from datetime import datetime

from models.base_model import BaseModel
from models.model_types import ModelTypes
from models.room import Room


class Message(BaseModel):
    """
    Message model class

    Inherits BaseModel, represents a message sent by a user in a chat room
    Is connected to the room and the user by their uuid

    Attributes:
        body:           string body of the message
        created:        date time of the message creation
        user:           user instance who sent a message
        room_uuid:      room uuid who sent a message
    """
    TYPE = ModelTypes.MESSAGE

    def __init__(self, body, user, room_uuid, created):
        super().__init__()
        self.body = body
        self.user = user
        self.room_uuid = room_uuid
        self.created = created

    @classmethod
    def from_data(cls, body, user, room_uuid, created):
        """
        Constructs the message instance from the provided data

        :param body:            string message body
        :param user:            user instance
        :param room_uuid:       room uuid
        :param created:         date time of the message creation
        :return                 message instance
        """
        message = cls(body, user, room_uuid, created)
        return message

    @classmethod
    async def create(cls, body, user, room: Room):
        """
        Creates the message instance

        :param body:        string message body
        :param user:        user instance who sent a message
        :param room:        room instance where message was sent
        :return:
        """
        created = datetime.now().isoformat()
        message = cls(body, user, room.uuid, created)
        cls.logger.debug(f"created {message}")

        await room.add_message(message)
        await cls.storage.put(message)

        return message

    async def get_room(self):
        """
        Gets the room of the message room

        :return:        room instance
        """
        return await Room.storage.get(ModelTypes.ROOM, self.room_uuid)

    async def change(self):
        """
        Line change is not implemented

        :return: None
        """
        raise NotImplementedError

    def get_dict(self) -> dict:
        """
        Dictionary representation with uuid, body, name, user_uuid, room_uuid and creation attr

        :return:            dictionary representation
        """
        return {
            "uuid": self.uuid,
            "body": self.body,
            "name": self.name,
            "user": self.user.get_dict(),
            "room_uuid": self.room_uuid,
            "created": self.created
        }
