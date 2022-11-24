from __future__ import annotations

from storage.exceptions import NotFoundException
from .base_model import BaseModel
from .model_types import ModelTypes
from .room import Room


class User(BaseModel):
    """
    User model class

    Inherits BaseMode, represents a user
    Attributes:
        room_uuid:      uuid of the room, instance entered
    """
    TYPE = ModelTypes.USER

    def __init__(self):
        super().__init__()
        self.room_uuid = None

    def __str__(self):
        return self.name

    @classmethod
    def from_data(cls, name: str, uuid: str, room_uuid: str):
        """
        Constructs the user instance from the provided data

        :param name:            user name
        :param uuid:            user uuid
        :param room_uuid:       user room uuid
        :return:                user instance
        """
        user = cls()
        user.uuid = uuid
        user.name = name
        user.room_uuid = room_uuid

        return user

    async def get_room(self):
        """
        Gets the entered room of user

        :return:        entered room or None
        """
        self.logger.debug(f"getting room of {self}")
        try:
            room = await Room.storage.get(ModelTypes.ROOM, self.room_uuid)
            return room
        except NotFoundException:
            return None

    async def enter_room(self, room) -> Room:
        """
        Entered the specified room

        :param room:        room instance
        :return:            old room instance
        """
        self.logger.debug(f"{self} entering {room}")
        old_room = None
        if self.room_uuid:
            old_room = await Room.get(self.room_uuid)
            await old_room.remove_user(self)
        self.room_uuid = room.uuid
        await self.storage.put(self)
        await room.add_user(self)

        if old_room:
            return old_room


    async def leave_room(self):
        """
        Leaves previously entered room

        :return:            None
        """
        if self.room_uuid:
            self.logger.debug(f"{self} leaving from {ModelTypes.ROOM}")
            room = await Room.storage.get(ModelTypes.ROOM, self.room_uuid)
            self.room_uuid = None
            await room.remove_user(self)
            await self.storage.put(self)
        else:
            self.logger.debug(f"{self} is not in room")

    async def change(self, name=None):
        """
        Changes the user name

        :param name:        optional new user name
        :return:            None
        """
        if name:
            self.logger.debug(f"changing name of {self} to {name}")
            self.name = name
        await self.storage.put(self)

    def get_dict(self) -> dict:
        """
        Dictionary representation with uuid, name, room_uuid

        :return:            dictionary representation
        """
        self.logger.debug(f"crated dict for {self}")

        return {
            "uuid": str(self.uuid),
            "name": self.name,
            "room_uuid": self.room_uuid
        }
