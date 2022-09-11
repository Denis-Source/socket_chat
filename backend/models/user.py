from __future__ import annotations

from logging import getLogger

from config import Config
from storage.exceptions import NotFoundException
from .base_model import BaseModel
from .model_types import ModelTypes


class User(BaseModel):
    storage = Config.STORAGE_CLS()
    TYPE = ModelTypes.USER
    logger = getLogger(TYPE)

    def __init__(self):
        super().__init__()
        self.room = None
        self.room_uuid = None

    def __str__(self):
        return self.name

    @classmethod
    def from_data(cls, name: str, uuid: str, room_uuid: str, **kwargs):
        user = cls()
        user.uuid = uuid
        user.name = name
        user.room_uuid = room_uuid

        return user

    async def get_room(self):
        self.logger.debug(f"getting room of {self}")
        try:
            room = await self.storage.get(ModelTypes.ROOM, self.room_uuid)
            return room
        except NotFoundException:
            return None

    async def enter_room(self, room):
        self.logger.debug(f"{self} entering {room}")
        self.room_uuid = room.uuid
        await self.storage.put(self)
        await room.add_user(self)

    async def leave_room(self):
        if self.room_uuid:
            self.logger.debug(f"{self} leaving from {ModelTypes.ROOM}")
            room = await self.storage.get(ModelTypes.ROOM, self.room_uuid)
            self.room_uuid = None
            await room.remove_user(self)
            await self.storage.put(self)
        else:
            self.logger.debug(f"{self} is not in room")

    async def change(self, name=None, room_uuid=None, **kwargs):
        if name:
            self.logger.debug(f"changing name of {self} to {name}")
            self.name = name
        if room_uuid:
            self.logger.debug(f"changing room uuid of {self}")
            raise NotImplementedError
        await self.storage.put(self)

    def get_dict(self) -> dict:
        self.logger.debug(f"crated dict for {self}")

        return {
            "type": self.TYPE.value,
            "uuid": str(self.uuid),
            "name": self.name,
            "room": self.room_uuid
        }
