import asyncio
import json
from json import JSONDecodeError
from logging import getLogger

import websockets
from websockets.exceptions import ConnectionClosedError

from config import Config
from models.color import ColorException, Color
from models.line import Line
from models.message import Message
from models.room import Room
from models.user import User
from statements.general_statements import GeneralStatements
from statements.statement_types import StatementTypes
from statements.user_statements import UserResultStatements, UserCallStatements
from storage.alchemy_storage import AlchemyStorage
from storage.exceptions import NotSpecifiedException
from .utils import prepare_statement

from statements.drawing_statements import \
    DrawingErrorStatements, DrawingCallStatements, DrawingResultStatements
from statements.message_statements import \
    MessageResultStatements, MessageErrorStatements, MessageCallStatements
from statements.room_statements import \
    RoomCallStatements, RoomResultStatements, RoomErrorStatements


class Server:
    """
    Main server connection handler class

    Attributes:
        storage:            storage instance
        logger:             ...logger
        call_methods:       dictionary of mapped methods to call statements
    """
    NAME = "server"

    def __init__(self):
        self.storage: AlchemyStorage = Config.STORAGE_CLS()
        self.logger = getLogger(self.NAME)

        self.connections = {}

        self.call_methods = {
            RoomCallStatements.CREATE_ROOM: self.create_room,
            RoomCallStatements.DELETE_ROOM: self.delete_room,
            RoomCallStatements.LIST_ROOMS: self.list_rooms,
            RoomCallStatements.ENTER_ROOM: self.enter_room,
            RoomCallStatements.LEAVE_ROOM: self.leave_room,
            RoomCallStatements.CHANGE_ROOM_COLOR: self.change_room_color,
            RoomCallStatements.CHANGE_ROOM_NAME: self.change_room_name,

            UserCallStatements.CHANGE_USER_NAME: self.change_user_name,

            MessageCallStatements.CREATE_MESSAGE: self.create_message,
            MessageCallStatements.LIST_MESSAGES: self.list_messages,

            DrawingCallStatements.CHANGE_DRAW_LINE: self.change_draw_line,
            DrawingCallStatements.GET_DRAWING: self.get_drawing,
            DrawingCallStatements.RESET_DRAWING: self.reset_drawing
        }

    async def handle_connection(
            self, connection: websockets.WebSocketServerProtocol):
        """
        Handles a connection between a user an a server

        Creates a user instance
        When connection is closed, deletes connection from the list

        :param connection:  websocket connection
        :return:            None
        """
        user = await self.storage.create_user()

        self.connections[user.uuid] = connection
        self.logger.info(f"{user} connected")
        try:
            await self.handle_user(user)
        except ConnectionClosedError:
            self.logger.info(f"{user} closed the connection")
        finally:
            self.logger.info(f"{user} disconnected")
            self.connections.pop(user.uuid)
            room = await self.storage.leave_room(user)
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)

    async def handle_user(self, user: User):
        """
        Listens for a message and calls the corresponding method

        Sends a user instance and room list
        If the message is not parsable, sends an error message
        :param connection:      Websocket connection
        :param user:            User to serve to
        :return:                None
        """
        self.logger.info("Handling user request")
        await self.connections.get(user.uuid).send(prepare_statement(
            type=StatementTypes.RESULT,
            message=UserResultStatements.USER_CREATED,
            object=user.get_dict()
        ))
        await self.list_rooms(user, {})

        # Websocket connection is based on a generator,
        # so the `for` loop is used
        async for raw_message in self.connections.get(user.uuid):
            try:
                self.logger.debug(
                    f"Received message: {raw_message.replace('/n', '')}")
                # Parse the message
                memo = json.loads(raw_message)
                payload = memo["payload"]
                method_type = payload["message"]
                method = self.call_methods[method_type]

                self.logger.info(f"handling call {method_type}")
                await method(user, payload)

            # If the message is not parsable or does not
            # have needed keys, send error message

            # This is applied to the all call methods
            # as we wrap them all with this except block
            except (JSONDecodeError, KeyError):
                self.logger.info(f"Bad data from {user}")
                await self.connections.get(user.uuid).send(
                    prepare_statement(
                        type=StatementTypes.RESULT,
                        message=GeneralStatements.BAD_DATA
                    ))

    # room methods
    async def create_room(self, user: User, _: dict):
        """
        Creates room, notifies all connected users
        :param user:    User that called the method
        :param _:       Dummy param to save a signature
        :return:        None
        """
        room = await self.storage.create_room()
        self.logger.info(f"Created room: {room} for {user}")
        await self.broadcast_room(room, RoomResultStatements.ROOM_CREATED)

    async def list_rooms(self, user: User, _: dict):
        """
        Lists all of the rooms

        :param user:    User that called the method
        :param _:       Dummy param to save a signature
        :return:        None
        """
        rooms = await self.storage.list_rooms()
        self.logger.info(f"Retrieved rooms list for {user}")
        await self.connections.get(user.uuid).send(
            prepare_statement(
                type=StatementTypes.RESULT,
                message=RoomResultStatements.ROOMS_LISTED,
                list=[room.get_dict() for room in rooms]
            ))

    async def enter_room(self, user: User, payload: dict):
        """
        Inserts the user into the room he specified
        Sends user room messages and drawing

        :param user:        User that called the method
        :param payload:     Payload that should include `uuid` of the room
        :return:            None
        """
        try:
            room_uuid = payload["uuid"]
            room = await self.storage.get_room(room_uuid)
            old_room, room = await self.storage.enter_room(room, user)

            history = await self.storage.list_messages(room)

            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.RESULT,
                message=RoomResultStatements.ROOM_ENTERED
            ))
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.RESULT,
                message=MessageResultStatements.MESSAGES_LISTED,
                list=[message.get_dict() for message in history]
            ))
            await self.get_drawing(user, {})

            if old_room:
                await self.broadcast_room(
                    old_room, RoomResultStatements.ROOM_CHANGED)
            await self.broadcast_room(
                room, RoomResultStatements.ROOM_CHANGED)

        except NotSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NO_SPECIFIED_ROOM
            ))

    async def leave_room(self, user: User, _: dict):
        """
        Removes a user from the entered previously room

        :param user:    User that called the method
        :param _:       Dummy param to save the signature
        :return:        None
        """

        room = await self.storage.leave_room(user)

        if room:
            self.logger.info(f"{user} left {user.room}")

            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.RESULT,
                message=RoomResultStatements.ROOM_LEFT
            ))
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)
        else:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NO_SPECIFIED_ROOM
            ))

    async def delete_room(self, user: User, payload: dict):
        """
        Deletes the room specified by a user
        Broadcasts the updated room to all connected users

        :param user:        User that called the method
        :param payload:     Payload that should include `uuid` of the room
        :return:
        """
        try:
            room_uuid = payload["uuid"]
            room = await self.storage.get_room(room_uuid)
            self.logger.info(f"Trying to delete room {room}")
            if not room.users:
                await self.storage.delete_room(room)
                self.logger.info(f"Room {room} deleted")
                await self.broadcast_room(
                    room, RoomResultStatements.ROOM_DELETED)
            else:
                self.logger.info(
                    f"Room {room} is not empty ({len(room.users)}) users")
                await self.connections.get(user.uuid).send(prepare_statement(
                    type=StatementTypes.ERROR,
                    message=RoomErrorStatements.NOT_EMPTY_ROOM
                ))

        except NotSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send([prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NO_SPECIFIED_ROOM
            )])

    async def change_room_name(self, user: User, payload: dict):
        """
        Changes a name of the specified room
        :param user:        User that called the method
        :param payload:     Payload that should include `uuid` and `name`
        :return:            None
        """
        try:
            room_uuid = payload["uuid"]
            room_name = payload["name"]
            room = await self.storage.get_room(room_uuid)
            room = await self.storage.change_room(name=room_name, room=room)
            self.logger.info(f"Changing name for {room} to {room_name}")
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)
        except NotSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NO_SPECIFIED_ROOM
            ))

    async def change_room_color(self, user: User, payload: dict):
        """
        Changes a color of the specified room
        Color should have hexadecimal format e.g: #ffffff

        :param user:        User that called the method
        :param payload:     Payload that should include `uuid` and `color`
        :return:            None
        """
        try:
            room_uuid = payload["uuid"]
            color = payload["color"]
            room = await self.storage.get_room(room_uuid)
            self.logger.info(f"Changing color of {room}")
            room = await self.storage.change_room(room, color=color)
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)

        except NotSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NO_SPECIFIED_ROOM
            ))
        except ColorException:
            self.logger.info(f"Not valid color from {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=RoomErrorStatements.NOT_VALID_COLOR
            ))

    async def broadcast_room(
            self, changed_room: Room, message: RoomResultStatements):
        """
        Broadcasts the room with a specified message

        :param changed_room:    Room that changed
        :param message:         Result message related to a change
        :return:                None
        """
        for _, connection in self.connections.items():
            await connection.send(prepare_statement(
                type=StatementTypes.RESULT,
                message=message,
                object=changed_room.get_dict()
            ))

    # drawing methods
    async def change_draw_line(self, user: User, payload: dict):
        """
        Changes or adds a line to the drawing

        :param user:        User that called the method
        :param payload:     Payload that should include
            `uuid`, `points` `color` and a `tool` of the lines

        :return:            None
        """
        if user.room:
            line_uuid = payload["uuid"]
            points = payload["points"]
            color = payload["color"]
            tool = payload["tool"]

            line = Line(
                tool=tool,
                color=color,
                points=points,
                uuid=line_uuid
            )
            await self.storage.change_drawing(user.room, line)
            self.logger.info(f"Updating {user.room.drawing} from {user}")

            await self.broadcast_drawing_line(line, user.room)
        else:
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=DrawingErrorStatements.NO_SELECTED_ROOM
            ))

    async def get_drawing(self, user: User, _: dict):
        """
        Sends to the user drawing of the room

        :param user:    User that called the method
        :param _:       Dummy param to save the signature
        :return:        None
        """
        if user.room:
            self.logger.info(f"Sending drawing  to {user}")

            drawing = await self.storage.get_drawing(user.room)

            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.RESULT,
                message=DrawingResultStatements.DRAWING_GOT,
                object=drawing.get_dict()
            ))
        else:
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=DrawingErrorStatements.NO_SELECTED_ROOM
            ))

    async def reset_drawing(self, user: User, _: dict):
        """
        Resets the drawing as asked by a user

        :param user:    User that called the method
        :param _:       Dummy param to save the signature
        :return:        None
        """
        if user.room:
            await self.storage.reset_drawing(user.room)

            room = await self.storage.get_room(user.room.uuid)
            drawing = await self.storage.get_drawing(user.room)
            self.logger.info(f"{user} resetting {user.room.drawing}")

            for user in room.users:
                connection = self.connections.get(user.uuid)
                if connection:
                    await connection.send(prepare_statement(
                        type=StatementTypes.RESULT,
                        message=DrawingResultStatements.DRAWING_GOT,
                        object=drawing.get_dict()
                    ))
        else:
            self.logger.info(f"No room found for {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=DrawingErrorStatements.NO_SELECTED_ROOM
            ))

    async def broadcast_drawing_line(self, line: Line, room: Room):
        """
        Broadcasts a line of a drawing to the users that are in the room

        :param line:    Line to broadcast
        :param room:    Room of the drawing
        :return:        None
        """
        self.logger.info(f"Broadcasting {line} line in {room}")

        room = await self.storage.get_room(room.uuid)
        for user in room.users:
            connection = self.connections.get(user.uuid)
            if connection:
                await self.connections.get(user.uuid).send(prepare_statement(
                    type=StatementTypes.RESULT,
                    message=DrawingResultStatements.DRAW_LINE_CHANGED,
                    object=line.get_dict()
                ))

    # user methods
    async def change_user_name(self, user: User, payload: dict):
        """
        Changes user name to the specified one
        Changes user name to the specified one
        Notifies all of the users if the user is in a room

        :param user:        User that called the method
        :param payload:     Payload that should include `name`
        :return:            None
        """
        name = payload["name"]
        self.logger.info(f"Changed {user} name to {name}")
        user.set_name(name)

        await self.connections.get(user.uuid).send(prepare_statement(
            type=StatementTypes.RESULT,
            message=UserResultStatements.USER_CHANGED,
            object=user.get_dict()
        ))

        if user.room:
            await self.broadcast_room(
                user.room, RoomResultStatements.ROOM_CHANGED)

    # message methods
    async def create_message(self, user: User, payload: dict):
        """
        Creates a message, adds it to the room of the user

        :param user:        User that called the method
        :param payload:     Payload that should include `body`
        :return:            None
        """
        body = payload["body"]
        if user.room:
            room = await self.storage.get_room(user.room.uuid)
            message = await self.storage.create_message(body=body, room=room,
                                                        user=user)
            self.logger.info(f"Creating {message} ({body[:10]}) from {user}")
            await self.broadcast_room(
                user.room, RoomResultStatements.ROOM_CHANGED)
            await self.broadcast_message(message)
        else:
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=MessageErrorStatements.NO_SELECTED_ROOM
            ))

    async def broadcast_message(self, message: Message):
        """
        Broadcasts the message among the users in the message room

        :param message:     Message to be broadcasted
        :return:            None
        """
        self.logger.info(f"Broadcasting {message} in room {message.room}")
        for user in message.room.users:
            connection = self.connections.get(user.uuid)
            if connection:
                await connection.send(prepare_statement(
                    type=StatementTypes.RESULT,
                    message=MessageResultStatements.MESSAGE_CREATED,
                    object=message.get_dict()
                ))

    async def list_messages(self, user: User, _: dict):
        """
        List all of the messages in the room

        :param user:    User that called the method
        :param _:       Dummy param to save the signature
        :return:        None
        """
        if user.room:
            self.logger.info(
                f"Sending message list({len(user.name)}) to {user}")
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.RESULT,
                message=MessageResultStatements.MESSAGES_LISTED,
                list=[message.get_dict() for message in user.room.messages]
            ))
        else:
            await self.connections.get(user.uuid).send(prepare_statement(
                type=StatementTypes.ERROR,
                message=MessageErrorStatements.NO_SELECTED_ROOM
            ))

    def run(self):
        """
        Runs the websocket server on the specified ip and port in the configs

        Websockets use asyncio, so the event loop is required

        :return: None
        """
        loop = asyncio.get_event_loop()
        try:
            loop.run_until_complete(self.storage.init())
            socket_server = websockets.serve(
                self.handle_connection, Config.IP, Config.PORT)
            self.logger.info("starting server")
            loop.run_until_complete(socket_server)
            loop.run_forever()
        finally:
            loop.close()
            self.logger.info("successfully shut down")
