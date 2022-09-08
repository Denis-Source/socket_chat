from logging import getLogger

from .base_model import BaseModel
from .model_types import ModelTypes


class Message(BaseModel):
    """
    Message model

    Inherits from BaseModel

    Attributes:
        body:       message text
        user:       user that sent a message
        room:       location of the message
        name:       name of the message
    """
    TYPE = ModelTypes.MESSAGE
    logger = getLogger(f"{TYPE}-model")

    def __init__(self, body: str, user, room, uuid=None):
        super().__init__(uuid=uuid)
        self.body = body
        self.user = user
        self.room = room
        self.name = f"{self.TYPE}-{self.uuid}"

        self.logger.debug(f"created {self}")

    def __str__(self):
        return self.name

    def get_dict(self) -> dict:
        self.logger.debug(f"crated dict from {self}")

        return {
            "type": self.TYPE,
            "uuid": self.uuid,
            "body": self.body,
            "created": self.created,
            "user": self.user.get_dict(),
            "room": self.room.get_dict(),
            "name": self.name
        }
