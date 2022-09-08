from enum import Enum
from logging import getLogger
from random import choice

from .color import Color
from .base_model import BaseModel
from .drawing import Drawing
from .message import Message
from .model_types import ModelTypes


class DefaultRoomColors(str, Enum):
    WHITT = "#ffffff"
    GRUN = "#5da247"
    GELP = "#fbeb50"
    BLAU = "#2b347e"
    ROT = "#cf2e24"
    ORANGE = "#e69635"
    ROSA = "#d95d98"
    VIOLETT = "#5e297e"
    GRAU = "#888888"
    BEIGE = "#e79d7e"


class UserNotInRoomException(Exception):
    """
    Raised if user is not in the room
    """
    pass


class Room(BaseModel):
    """
    Chat room Model, it's users, messages, drawing

    Inherits BaseModel

    Attributes:
        name:       name of the room
        users:      list of entered users
        messages:   list of the room messages
        drawing:    drawing of the room
        color:      color of the room
    """

    TYPE = ModelTypes.ROOM
    logger = getLogger(TYPE)

    def __init__(self, uuid: str = None,
                 name: str = None, color: str = None):
        super().__init__(uuid)

        self.name = name
        if not self.name:
            self.name = f"{self.TYPE}-{self.uuid}"
        self.users = []
        self.messages = []
        self.drawing = None
        self.logger.debug(f"Created room {self}")
        self.sum = 0

        if not color:
            self.color = choice([e.value for e in DefaultRoomColors])
        else:
            self.color = Color(color).value

    def set_drawing(self, drawing: Drawing):
        self.drawing = drawing

    def __str__(self):
        return self.name

    def add_user(self, user):
        """
        Adds user to the room

        :param user:    User that entered the room
        :return:        None
        """
        self.users.append(user)
        self.logger.debug(f"Added {user} to {self}")

    def remove_user(self, user):
        """
        Removes the user from the room

        :param user:    User that left
        :return:        None
        """

        if user in self.users:
            self.users.remove(user)
            self.logger.debug(f"Removed {user} from {self}")
        else:
            self.logger.debug(f"{user} is not in {self}")
            raise UserNotInRoomException(f"No {user} in {self}")

    def add_message(self, message: Message):
        """
        Adds the message to the room

        :param message:     Message that should be added
        :return:            None
        """
        self.messages.append(message)
        self.sum += 1
        self.logger.debug(f"Added {message} to {self}")

    def set_color(self, color: Color):
        """
        Sets the color of the room

        :param color:   Color to set to
        :return:        None
        """
        self.color = color.value
        self.logger.debug(f"set color {color} for {self}")

    def set_name(self, name: str):
        """
        Sets the name of the room

        :param name:    Name to set to
        :return:        None
        """
        self.logger.debug(f"set name {name} for {self}")
        self.name = name

    def get_dict(self) -> dict:
        """
        Generates the dictionary based on the attributes

        :return:
        """
        self.logger.debug(f"creating dict for {self}")

        return {
            "type": self.TYPE,
            "uuid": str(self.uuid),
            "name": self.name,
            "color": self.color,
            "users": [user.get_dict() for user in self.users],
            "sum": self.sum,
        }
