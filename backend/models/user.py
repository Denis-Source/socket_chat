from websockets.legacy.server import WebSocketServerProtocol
from logging import getLogger

from .base_model import BaseModel
from .model_types import ModelTypes
from .room import Room


class User(BaseModel):
    """
    User model

    Inherits from model
    Attributes:
        name:           user name
        room:           entered room
    """
    TYPE = ModelTypes.USER
    logger = getLogger(TYPE)

    def __init__(self, uuid=None, name=None):
        super().__init__(uuid)
        self.name = name
        if not self.name:
            self.name = f"{self.TYPE}-{self.uuid}"
        self.room = None
        self.logger.debug(f"created {self}")

    def __str__(self):
        return self.name

    def set_room(self, room: Room):
        """
        Sets the room of the user

        :param room:    room to enter
        :return:        None
        """
        self.room = room
        self.logger.debug(f"Setting room {room} from {self}")

    def set_name(self, name: str):
        """
        Sets user name

        :param name:    new user name
        :return:        None
        """

        self.logger.debug(f"Changing name for {self} to {name}")
        self.name = name

    def leave_room(self):
        """
        Resets user room

        :return: None
        """

        self.logger.debug(f"leaving room {self.room}")
        self.room = None

    def get_dict(self):
        self.logger.debug(f"crated dict from {self}")

        return {
            "type": self.TYPE,
            "uuid": str(self.uuid),
            "name": self.name,
        }
