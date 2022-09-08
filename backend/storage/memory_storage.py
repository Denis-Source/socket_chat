from logging import getLogger
from typing import List, Tuple

from models.color import Color
from models.drawing import Drawing
from models.line import Line
from models.message import Message
from models.room import Room
from models.user import User
from .base_storage import BaseStorage
from .exceptions import NotSpecifiedException


class MemoryStorage(BaseStorage):
    NAME = "mem_stor"
    rooms = {}
    users = {}
    logger = getLogger(NAME)

    async def init(self):
        pass

    async def create_user(self) -> User:
        user = User()
        self.logger.debug(f"creating {User.TYPE} {user}")
        self.users[user.uuid] = user
        return user

    async def get_user(self, uuid) -> User:
        try:
            self.logger.debug(f"getting {User.TYPE}")
            user = self.users[uuid]
            return user
        except ValueError:
            raise NotSpecifiedException(uuid, User.TYPE)

    async def delete_user(self, user: User):
        self.logger.debug(f"deleting {User.TYPE} {user}")
        try:
            self.users.pop(user.uuid)
        except KeyError:
            raise NotSpecifiedException(user.uuid, User.TYPE)

    async def change_user(self, user: User, name: str = None):
        try:
            user = self.users[user.uuid]
            if name:
                user.set_name(name)
        except ValueError:
            raise NotSpecifiedException(user.uuid, User.TYPE)

    async def list_users(self) -> List[User]:
        self.logger.debug("listing users")
        return [user for _, user in self.users.items()]

    async def get_room(self, uuid: str) -> Room:
        self.logger.debug(f"searching {Room.TYPE} with {uuid}")
        try:
            return self.rooms[uuid]
        except ValueError:
            self.logger.debug(f"{Room.TYPE} with {uuid} not found")
            raise NotSpecifiedException(uuid, Room.TYPE)

    async def enter_room(self, room: Room, user: User) -> Tuple[Room, Room]:
        self.logger.debug(f"adding {user} to {room}")
        try:
            room = self.rooms[room.uuid]
            user = self.users[user.uuid]

            old_room = user.room
            if old_room:
                old_room.users.remove(user)
            user.set_room(room)
            room.add_user(user)

            return old_room, room

        except ValueError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def leave_room(self, user: User) -> Room:
        user = self.users[user.uuid]
        self.logger.debug(f"removing {user}")
        room = user.room
        room.remove_user(user)
        user.leave_room()
        return room

    async def list_rooms(self):
        self.logger.debug(f"listing {Room.TYPE}")
        return [room for _, room in self.rooms.items()]

    async def delete_room(self, room: Room):
        try:
            room = self.rooms[room.uuid]
            self.logger.debug(f"deleting {room}")
            self.rooms.pop(room.uuid)
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def create_room(self) -> Room:
        room = Room()
        room.set_drawing(Drawing())
        self.logger.debug(f"creating {Room.TYPE} {room}")
        self.rooms[room.uuid] = room
        return room

    async def change_room(self, room: Room, color: str = None, name: str = None) -> Room:
        try:
            room = self.rooms[room.uuid]
            if color:
                self.logger.debug(f"setting {Color.TYPE} {color} for {room}")
                room.set_color(Color(color))
            if name:
                self.logger.debug(f"setting name for {room}")
                room.set_name(name)
            return room
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def get_drawing(self, room) -> Drawing:
        try:
            self.logger.debug(f"getting {Drawing.TYPE} from {room}")
            return room.drawing
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def reset_drawing(self, room: Room):
        try:
            self.logger.debug(f"resetting {Drawing.TYPE} from {room}")
            room = self.rooms[room.uuid]
            room.drawing.reset()
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def change_drawing(self, room: Room, line: Line) -> Drawing:
        self.logger.debug(f"changing {Drawing.TYPE}")
        room.drawing.add_line(line)
        return room.drawing

    async def create_message(self, body: str, room: Room, user: User) -> Message:
        try:
            self.logger.debug(f"Creating {Message.TYPE} in {room}")
            room = self.rooms[room.uuid]
            message = Message(body, user, room)
            room.add_message(message)
            return message
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)

    async def list_messages(self, room: Room) -> List[Message]:
        try:
            self.logger.debug(f"Creating {Message.TYPE} in {room}")
            room = self.rooms[room.uuid]
            return room.messages
        except KeyError:
            raise NotSpecifiedException(room.uuid, Room.TYPE)
