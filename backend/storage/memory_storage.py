from logging import getLogger

import models
from models.model_types import ModelTypes
from storage.base_storage import BaseStorage
from storage.exceptions import NotFoundException


class MemoryStorage(BaseStorage):
    NAME = "mem_storage"
    logger = getLogger(NAME)

    _users = {}
    _rooms = {}
    _messages = {}
    _drawings = {}
    _lines = {}

    async def _get_user(self, uuid: str) -> "models.user.User":
        self.logger.debug(f"getting {ModelTypes.USER} from {self}")
        try:
            user = self._users[uuid]
            self.logger.debug(f"got {ModelTypes.USER} {user} from {self}")
            return user
        except KeyError:
            self.logger.debug(f"{ModelTypes.USER} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.USER)

    async def _get_room(self, uuid: str) -> "models.room.Room":
        self.logger.debug(f"getting {ModelTypes.ROOM} from {self}")
        try:
            room = self._rooms[uuid]
            self.logger.debug(f"got {ModelTypes.ROOM} {room} from {self}")
            return room
        except KeyError:
            self.logger.debug(f"{ModelTypes.ROOM} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.ROOM)

    async def _get_message(self, uuid: str) -> "models.message.Message":
        self.logger.debug(f"getting {ModelTypes.MESSAGE} from {self}")
        try:
            message = self._messages[uuid]
            self.logger.debug(f"got {ModelTypes.MESSAGE} {message} from {self}")
            return message
        except KeyError:
            self.logger.debug(f"{ModelTypes.MESSAGE} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.MESSAGE)

    async def _get_drawing(self, uuid: str) -> "models.drawing.Drawing":
        self.logger.debug(f"getting {ModelTypes.DRAWING} from {self}")
        try:
            drawing = self._drawings[uuid]
            self.logger.debug(f"got {ModelTypes.DRAWING} {drawing} from {self}")
            return drawing
        except KeyError:
            self.logger.debug(f"{ModelTypes.DRAWING} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.DRAWING)

    async def _list_rooms(self):
        self.logger.debug(f"listing {ModelTypes.ROOM}s in {self}")
        rooms = [room for _, room in self._rooms.items()]
        self.logger.debug(f"listed {ModelTypes.ROOM}s" in {self})
        return rooms

    async def _put_user(self, user: "models.user.User"):
        self.logger.debug(f"putting {ModelTypes.USER} {user} in {self}")
        self._users[user.uuid] = user
        self.logger.debug(f"{ModelTypes.USER} {user} put in {self}")

    async def _put_room(self, room: "models.room.Room"):
        self.logger.debug(f"putting {ModelTypes.ROOM} {room} in {self}")
        self._rooms[room.uuid] = room
        self.logger.debug(f"{ModelTypes.ROOM} {room} put in {self}")

    async def _put_message(self, message: "models.message.Message"):
        self.logger.debug(f"putting {ModelTypes.MESSAGE} {message} in {self}")
        self._messages[message.uuid] = message
        self.logger.debug(f"{ModelTypes.MESSAGE} {message} put in {self}")

    async def _put_drawing(self, drawing: "models.drawing.Drawing"):
        self.logger.debug(f"putting {ModelTypes.DRAWING} {drawing} in {self}")
        self._drawings[drawing.uuid] = drawing
        self.logger.debug(f"{ModelTypes.DRAWING} {drawing} put in {self}")

    async def _put_line(self, line: "models.line.Line"):
        self.logger.debug(f"putting {ModelTypes.LINE} {line} in {self}")
        self._lines[line.uuid] = line
        self.logger.debug(f"{ModelTypes.LINE} {line} put in {self}")

    async def _delete_user(self, user: "models.user.User"):
        try:
            self.logger.debug(f"deleting {ModelTypes.USER} {user} in {self}")
            self._users.pop(user.uuid)
            self.logger.debug(f"deleted {ModelTypes.USER} {user} in {self}")
        except KeyError:
            self.logger.debug(f"no {ModelTypes.USER} {user} in storage")

    async def _delete_room(self, room: "models.room.Room"):
        try:
            self.logger.debug(f"deleting {ModelTypes.ROOM} {room} in {self}")
            self._rooms.pop(room.uuid)
            self.logger.debug(f"deleting {ModelTypes.MESSAGE} in {ModelTypes.ROOM} {room}")
            for message in room.messages:
                self.logger.debug(f"deleting {ModelTypes.MESSAGE} {message}")
                self._messages.pop(message.uuid)
            self.logger.debug(f"deleted {ModelTypes.ROOM} {room} in {self}")
        except KeyError:
            self.logger.debug(f"no {ModelTypes.ROOM} {room} in storage")
