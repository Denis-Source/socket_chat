from enum import Enum
from logging import getLogger
from random import choice

from models.base_model import BaseModel
from models.color import Color
from models.drawing import Drawing
from models.model_types import ModelTypes


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


class Room(BaseModel):
    TYPE = ModelTypes.ROOM
    logger = getLogger(TYPE)

    def __init__(self, color):
        super().__init__()
        self.color = color
        self.users = []
        self.messages = []
        self.drawing = None
        self.drawing_uuid = None

    @classmethod
    def from_data(cls, name, uuid, color, users, messages, drawing, **kwargs):
        room = cls(color)
        room.name = name
        room.uuid = uuid
        room.users = users
        room.messages = messages
        room.drawing = drawing

        return room

    @classmethod
    async def create(cls, color=None, **kwargs):
        if color:
            color = Color(color).value
        else:
            color = choice([e.value for e in DefaultRoomColors])

        model = cls(color)
        model.drawing = await Drawing.create(model.uuid)
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    async def change(self, name: str = None, color: str = None, **kwargs):
        if name:
            self.logger.debug(f"changing name of {self} to {name}")
            self.name = name
        if color:
            self.logger.debug(f"changing color of {self} to {color}")
            self.color = Color(color).value
        await self.storage.put(self)

    async def add_user(self, user):
        self.logger.debug(f"adding {user} to {self}")
        self.users.append(user)

    async def remove_user(self, user):
        self.logger.debug(f"removing {user} from {self}")
        self.users = list(filter(lambda _user: user.uuid != _user.uuid, self.users))
        await self.storage.put(self)

    async def get_drawing(self):
        return self.drawing

    async def get_users(self):
        return self.users

    async def add_message(self, message):
        self.logger.debug(f"adding {message} to {self}")
        self.messages.append(message)

    async def get_messages(self):
        return self.messages

    @classmethod
    async def delete(cls, model):
        cls.logger.debug(f"deleting {cls.TYPE} ({model.uuid})")
        for user in model.users:
            user = await cls.storage.get(ModelTypes.USER, user.uuid)
            await user.leave_room()
        await cls.storage.delete(model)

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE.value,
            "uuid": self.uuid,
            "name": self.name,
            "color": self.color,
            "users": [user.get_dict() for user in self.users],
            "sum": len(self.messages)
        }
