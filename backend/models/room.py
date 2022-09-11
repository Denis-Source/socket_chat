from enum import Enum
from random import choice

from models.base_model import BaseModel
from models.color import Color
from models.drawing import Drawing
from models.model_types import ModelTypes


class DefaultRoomColors(str, Enum):
    """
    Default room colors enumeration
    """
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


class Room(BaseModel):
    """
    Room model class

    Inherits BaseModel, represents a chat room
    Has users, messages and a drawing

    Attributes:
        color:          color of a room
        users:          list of users that entered a room
        messages:       list of messages that was sent into a room
        drawing:        drawing instance of a room
    """
    TYPE = ModelTypes.ROOM

    def __init__(self, color):
        super().__init__()
        self.color = color
        self.users = []
        self.messages = []
        self.drawing = None

    @classmethod
    def from_data(cls, name, uuid, color, users, messages, drawing):
        """
        Constructs the room instance from the provided data

        :param name:            room name
        :param uuid:            room uuid
        :param color:           room color
        :param users:           room users instance
        :param messages:        room message instances
        :param drawing:         room drawing instances
        :return:                room instance
        """
        room = cls(color)
        room.name = name
        room.uuid = uuid
        room.users = users
        room.messages = messages
        room.drawing = drawing

        return room

    @classmethod
    async def create(cls, color=None):
        """
        Creates the message instance

        :param color:       optional room hexadecimal color if not provided,
                            a random one from the defaults will be used instead
        :return:            room instance
        """
        if color:
            color = Color(color).value
        else:
            color = choice([e.value for e in DefaultRoomColors])

        model = cls(color)
        model.drawing = await Drawing.create(model.uuid)
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    async def change(self, name: str = None, color: str = None):
        """
        Changes room name or/and color

        :param name:        optional new room name
        :param color:       optional new room color
        :return:            room instance
        """
        if name:
            self.logger.debug(f"changing name of {self} to {name}")
            self.name = name
        if color:
            self.logger.debug(f"changing color of {self} to {color}")
            self.color = Color(color).value
        await self.storage.put(self)

    async def add_user(self, user):
        """
        Adds user to the room

        :param user:        user instance
        :return:            None
        """
        self.logger.debug(f"adding {user} to {self}")
        self.users.append(user)

    async def remove_user(self, user):
        """
        Removes user from a room
        :param user         user instance
        :return:            None
        """
        self.logger.debug(f"removing {user} from {self}")
        self.users = list(filter(lambda _user: user.uuid != _user.uuid, self.users))
        await self.storage.put(self)

    async def get_drawing(self):
        """
        Gets drawing of the room
        :return:
        """
        return self.drawing

    async def get_users(self):
        """
        Gets list of users entered the room

        :return:        list of user instances
        """
        return self.users

    async def add_message(self, message):
        """
        Adds message to the room

        :param message:     message instance
        :return:            None
        """
        self.logger.debug(f"adding {message} to {self}")
        self.messages.append(message)

    async def get_messages(self):
        """
        Gets the list of room messages

        :return:        list of message instances
        """
        return self.messages

    @classmethod
    async def delete(cls, room):
        """
        Deletes the room from the repo

        :param room:        room instance
        :return:            None
        """
        cls.logger.debug(f"deleting {cls.TYPE} ({room.uuid})")
        for user in room.users:
            user = await cls.storage.get(ModelTypes.USER, user.uuid)
            await user.leave_room()
        await cls.storage.delete(room)

    def get_dict(self) -> dict:
        """
        Dictionary representation with uuid, name, color, list of users and sum of messages

        :return:            dictionary representation
        """
        return {
            "uuid": self.uuid,
            "name": self.name,
            "color": self.color,
            "users": [user.get_dict() for user in self.users],
            "sum": len(self.messages)
        }
