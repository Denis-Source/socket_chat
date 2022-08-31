from websockets.legacy.server import WebSocketServerProtocol
from logging import getLogger

from .base_model import BaseModel
from .model_types import ModelTypes


class User(BaseModel):
    TYPE = ModelTypes.USER
    logger = getLogger(TYPE)

    def __init__(self, connection: WebSocketServerProtocol):
        super().__init__()
        self.name = f"{self.TYPE}-{self.get_uuid()}"
        self.websocket = connection
        self.room = None
        self.logger.debug(f"created {self}")

    def __str__(self):
        return self.name

    def set_room(self, room):
        self.room = room
        self.logger.debug(f"Setting room {room} from {self}")

    def leave_room(self):
        self.logger.debug(f"leaving room {self.room}")
        self.room = None

    def get_dict(self):
        self.logger.debug(f"crated dict from {self}")

        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
        }
