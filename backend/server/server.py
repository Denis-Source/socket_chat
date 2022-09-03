import asyncio
import json
from json import JSONDecodeError

import websockets
from logging import getLogger

from websockets.exceptions import ConnectionClosedError

from config import Config
from models.message import Message
from models.room import Room, RoomColor, RoomColorException
from models.user import User
from statements.general_statements import GeneralStatements
from statements.message_statements import MessageResultStatements, MessageErrorStatements, MessageCallStatements
from statements.room_statements import RoomCallStatements, RoomResultStatements, RoomErrorStatements
from statements.statement_types import StatementTypes
from statements.user_statements import UserResultStatements, UserCallStatements
from storage.base_storage import NoRoomSpecifiedException


class Server:
    NAME = "server"

    connected_users = dict()
    logger = getLogger(NAME)

    def __init__(self):
        self.storage = Config.STORAGE_CLS()

        self.calls = {
            RoomCallStatements.CREATE_ROOM: self.create_room,
            RoomCallStatements.DELETE_ROOM: self.delete_room,
            RoomCallStatements.LIST_ROOMS: self.list_rooms,
            RoomCallStatements.ENTER_ROOM: self.enter_room,
            RoomCallStatements.LEAVE_ROOM: self.leave_room,
            RoomCallStatements.CHANGE_ROOM_COLOR: self.change_room_color,
            RoomCallStatements.CHANGE_ROOM_NAME: self.change_room_name,

            UserCallStatements.CHANGE_USER_NAME: self.change_user_name,

            MessageCallStatements.CREATE_MESSAGE: self.create_message,
            MessageCallStatements.LIST_MESSAGES: self.list_messages
        }

    async def send_rooms(self, user: User):
        rooms = self.storage.list_rooms()
        await user.connection.send(json.dumps(
            rooms
        ))
        self.logger.info(f"Send rooms({len(rooms)}) to {user}")

    async def handle_connection(self, connection: websockets.WebSocketServerProtocol):
        user = User(connection)
        self.logger.info(f"{user} connected")
        self.connected_users[user.get_uuid()] = user
        try:
            await self.handle_user(user)
        except ConnectionClosedError:
            self.logger.info(f"{user} closed the connection")
        finally:
            self.logger.info(f"{user} disconnected")
            user.leave_room()
            self.connected_users.pop(user.get_uuid())

    async def handle_user(self, user: User):
        self.logger.info(f"Handling user request")
        await user.connection.send(json.dumps({
            "type": StatementTypes.RESULT,
            "payload": {
                "message": UserResultStatements.USER_CREATED,
                "user": user.get_dict()
            }
        }))

        await self.list_rooms(user, {})

        async for raw_message in user.connection:
            try:
                self.logger.debug(f"Received message: {raw_message}")
                memo = json.loads(raw_message)

                payload = memo["payload"]
                method_type = payload["message"]
                method = self.calls[method_type]

                await method(user=user, payload=payload)

            except (JSONDecodeError, KeyError):
                self.logger.info(f"Bad data from {user}")
                await user.connection.send(json.dumps({
                    "type": StatementTypes.RESULT,
                    "payload": {
                        "message": GeneralStatements.BAD_DATA
                    }
                }))

    # room methods
    async def create_room(self, user: User, payload: dict):
        room = Room()
        self.storage.create_room(room)
        self.logger.info(f"Created room: {room} for {user}")
        await user.connection.send(json.dumps({
            "type": StatementTypes.RESULT,
            "payload": {
                "message": GeneralStatements.OK
            }
        }))
        await self.broadcast_room(room, RoomResultStatements.ROOM_CREATED)

    async def list_rooms(self, user: User, payload: dict):
        rooms = self.storage.list_rooms()
        self.logger.info(f"Retrieved rooms list for {user}")
        await user.connection.send(json.dumps({
            "type": StatementTypes.RESULT,
            "payload": {
                "message": RoomResultStatements.ROOMS_LISTED,
                "list": [room.get_dict() for room in rooms]
            }
        }))

    async def enter_room(self, user: User, payload: dict):
        try:
            room_uuid = payload["uuid"]
            old_room = user.room
            room: Room = self.storage.get_room(room_uuid)
            self.logger.info(f"Selected {room} for {user}")
            user.set_room(room)
            room.add_user(user)

            history = [message.get_dict() for message in room.messages]

            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": RoomResultStatements.ROOM_ENTERED
                }
            }))

            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": MessageResultStatements.MESSAGES_LISTED,
                    "list": history
                }
            }))
            if old_room:
                await self.broadcast_room(old_room, RoomResultStatements.ROOM_CHANGED)
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)

        except NoRoomSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NO_SPECIFIED_ROOM
                }
            }))

    async def leave_room(self, payload: dict, user: User):
        if user.room:
            room = user.room
            self.logger.info(f"{user} left {user.room}")
            user.leave_room()

            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": RoomResultStatements.ROOM_LEFT
                }
            }))
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)

        else:
            self.logger.info(f"No room found for {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NO_SPECIFIED_ROOM
                }
            }))

    async def delete_room(self, payload: dict, user: User):
        try:
            room_uuid = payload["uuid"]
            room: Room = self.storage.get_room(room_uuid)
            self.logger.info(f"Trying to delete room {room}")
            if not room.users:
                self.storage.delete_room(room_uuid)
                self.logger.info(f"Room {room} deleted")
                await user.connection.send(json.dumps({
                    "type": StatementTypes.RESULT,
                    "payload": {
                        "message": GeneralStatements.OK
                    }
                }))
                await self.broadcast_room(room, RoomResultStatements.ROOM_DELETED)
            else:
                self.logger.info(f"Room {room} is not empty ({len(room.users)}) users")
                await user.connection.send(json.dumps({
                    "type": StatementTypes.ERROR,
                    "payload": {
                        "message": RoomErrorStatements.NOT_EMPTY_ROOM
                    }
                }))
        except NoRoomSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NO_SPECIFIED_ROOM
                }
            }))

    async def change_room_name(self, payload: dict, user: User):
        try:
            room_uuid = payload["uuid"]
            room: Room = self.storage.get_room(room_uuid)
            room_name = payload["name"]

            self.logger.info(f"Changing name for {room} to {room_name}")
            room.set_name(room_name)
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": GeneralStatements.OK
                }
            }))
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)
        except NoRoomSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NO_SPECIFIED_ROOM
                }
            }))

    async def change_room_color(self, payload: dict, user: User):
        try:
            room_uuid = payload["uuid"]
            room: Room = self.storage.get_room(room_uuid)
            color = RoomColor(payload["color"])

            self.logger.info(f"Changing color of {room.name}")
            room.set_color(color)
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": GeneralStatements.OK
                }
            }))
            await self.broadcast_room(room, RoomResultStatements.ROOM_CHANGED)
        except NoRoomSpecifiedException:
            self.logger.info(f"No room found for {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NO_SPECIFIED_ROOM
                }
            }))
        except RoomColorException:
            self.logger.info(f"Not valid color from {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": RoomErrorStatements.NOT_VALID_COLOR
                }
            }))

    async def broadcast_room(self, changed_room: Room, message: RoomResultStatements):
        for _, user in self.connected_users.items():
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": message,
                    "room": changed_room.get_dict()
                }
            }))

    # user methods
    async def change_user_name(self, payload: dict, user: User):
        name = payload["name"]
        self.logger.info(f"Changed {user} name to {name}")
        user.set_name(name)
        await user.connection.send(json.dumps({
            "type": StatementTypes.RESULT,
            "payload": {
                "message": GeneralStatements.OK
            }
        }))
        await user.connection.send(json.dumps({
            "type": StatementTypes.RESULT,
            "payload": {
                "message": UserResultStatements.USER_CREATED,
                "user": user.get_dict()
            }
        }))

        if user.room:
            await self.broadcast_room(user.room, RoomResultStatements.ROOM_CHANGED)

    # message methods
    async def create_message(self, payload: dict, user: User):
        body = payload["body"]
        if user.room:
            message = Message(body, user, user.room)
            self.logger.info(f"Creating {message} ({body[:10]}) from {user}")
            user.room.add_message(message)
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": GeneralStatements.OK
                }
            }))
            await self.broadcast_room(user.room, RoomResultStatements.ROOM_CHANGED)
            await self.broadcast_message(message)
        else:
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": MessageErrorStatements.NO_SELECTED_ROOM
                }
            }))

    async def broadcast_message(self, message: Message):
        self.logger.info(f"Broadcasting {message} in room {message.room}")
        for user in message.room.users:
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": MessageResultStatements.MESSAGE_CREATED,
                    "object": message.get_dict()
                }
            }))

    async def list_messages(self, payload: dict, user: User):
        if user.room:
            self.logger.info(f"Sending message list({len(user.name)}) to {user}")
            await user.connection.send(json.dumps({
                "type": StatementTypes.RESULT,
                "payload": {
                    "message": MessageResultStatements.MESSAGES_LISTED,
                    "list": [message.get_dict() for message in user.room.messages]
                }
            }))
        else:
            await user.connection.send(json.dumps({
                "type": StatementTypes.ERROR,
                "payload": {
                    "message": MessageErrorStatements.NO_SELECTED_ROOM
                }
            }))

    def run(self):
        loop = asyncio.get_event_loop()
        try:
            socket_server = websockets.serve(self.handle_connection, Config.IP, Config.PORT)
            self.logger.info("starting server")
            loop.run_until_complete(socket_server)
            loop.run_forever()
        finally:
            loop.close()
            self.logger.info("successfully shut down")
