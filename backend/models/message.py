from datetime import datetime

from models.base_model import BaseModel
from models.model_types import ModelTypes
from models.room import Room


class Message(BaseModel):
    TYPE = ModelTypes.MESSAGE

    def __init__(self, body, user_uuid, room_uuid, created):
        super().__init__()
        self.body = body
        self.user_uuid = user_uuid
        self.room_uuid = room_uuid
        self.created = created

    @classmethod
    def from_data(cls, body, user_uuid, room_uuid, created, **kwargs):
        message = cls(body, user_uuid, room_uuid, created)
        return message

    @classmethod
    async def create(cls, body, user, room: Room):
        created = datetime.now().isoformat()
        message = cls(body, user.uuid, room.uuid, created)
        cls.logger.debug(f"created {message}")

        await room.add_message(message)
        await Message.storage.put(message)

        return message

    async def get_room(self):
        return await self.storage.get(ModelTypes.ROOM, self.room_uuid)

    async def change(self, **kwargs):
        raise NotImplementedError

    def get_dict(self) -> dict:
        return {
            "uuid": self.uuid,
            "body": self.body,
            "name": self.name,
            "user": self.user_uuid,
            "created": self.created
        }
