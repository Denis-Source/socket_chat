from logging import getLogger
import re
from enum import Enum
from random import choice

from .base_model import BaseModel
from .message import Message
from .model_types import ModelTypes
from .user import User


class RoomColorException(Exception):
    pass


class RoomColor:
    COLOR_RE = r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    TYPE = ModelTypes.ROOM_COLOR

    logger = getLogger(TYPE)

    def __init__(self, value):
        if self.check_color(value):
            self.value = value
            self.logger.debug(f"Created {self}")
        else:
            raise RoomColorException(f"{value} is not a valid color")

    def __str__(self):
        return self.value

    @staticmethod
    def check_color(color: str) -> bool:
        RoomColor.logger.debug(f"Checking color {color}")
        color_re = re.compile(RoomColor.COLOR_RE)
        if color_re.match(color):
            RoomColor.logger.debug(f"Color {color} is valid")
            return True
        RoomColor.logger.debug(f"Color {color} is not valid")
        return False


class DefaultRoomColors(str, Enum):
    WHITE = "#ffffff"
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
    pass


class Room(BaseModel):
    TYPE = ModelTypes.ROOM
    logger = getLogger(TYPE)

    def __init__(self, color: DefaultRoomColors = None):
        super().__init__()
        if not color:
            self.color = choice([e.value for e in DefaultRoomColors])
        else:
            self.color = color
        self.name = f"{self.TYPE}-{self.get_uuid()}"
        self.users = []
        self.messages = []
        self.logger.debug(f"Created room {self}")

    def __str__(self):
        return self.name

    def add_user(self, user: User):
        self.users.append(user)
        self.logger.debug(f"Added {user} to {self}")

    def add_message(self, message: Message):
        self.messages.append(message)
        self.logger.debug(f"Added {message} to {self}")

    def remove_user(self, user: User):
        if user in self.users:
            self.users.remove(user)
            self.logger.debug(f"Removed {user} from {self}")
        else:
            self.logger.debug(f"{user} is not in {self}")
            raise UserNotInRoomException(f"No {user} in {self}")

    def set_color(self, color: str):
        self.color = color
        self.logger.debug(f"set color {color} for {self}")

    def set_name(self, name: str):
        self.logger.debug(f"set name {name} for {self}")
        self.name = name

    def get_dict(self) -> dict:
        self.logger.debug(f"creating dict for {self}")

        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
            "color": self.color
        }
