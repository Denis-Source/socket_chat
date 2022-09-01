from websockets.legacy.server import WebSocketServerProtocol
from logging import getLogger

from .base_model import BaseModel
from .model_types import ModelTypes
from .room import Room


class User(BaseModel):
    TYPE = ModelTypes.USER
    logger = getLogger(TYPE)

    def __init__(self, connection: WebSocketServerProtocol):
        super().__init__()
        self.name = f"{self.TYPE}-{self.get_uuid()}"
        self.connection = connection
        self.room = None
        self.logger.debug(f"created {self}")

    def __str__(self):
        return self.name

    def set_room(self, room: Room):
        if self.room:
            self.room.remove_user(self)
        self.room = room
        room.add_user(self)
        self.logger.debug(f"Setting room {room} from {self}")

    def set_name(self, name: str):
        self.logger.debug(f"Changing name for {self} to {name}")
        self.name = name

    def leave_room(self):
        self.logger.debug(f"leaving room {self.room}")
        if self.room:
            self.room.remove_user(self)
            self.room = None

    def get_dict(self):
        self.logger.debug(f"crated dict from {self}")

        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
        }
