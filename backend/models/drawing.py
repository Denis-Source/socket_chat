from models.base_model import BaseModel
from models.line import Line
from models.model_types import ModelTypes


class Drawing(BaseModel):
    """
    Drawing model class

    Inherits BaseModel, represents user drawing in the chat room
    Is connected to the room by uuid

    Attributes:
        lines           list of drawn lines
        room_uuid       room uuid that the drawing is connected to
    """
    TYPE = ModelTypes.DRAWING

    def __init__(self, room_uuid):
        super().__init__()
        self.lines = []
        self.room_uuid = room_uuid

    @classmethod
    async def create(cls, room_uuid):
        """
        Creates a drawing instance, requires room uuid

        :param room_uuid:       uuid string of the room
        :return:                drawing instance
        """
        model = cls(room_uuid)
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    @classmethod
    def from_data(cls, uuid, name, room_uuid, lines):
        """
        Constructs the drawing instance from the provided data

        :param uuid:            drawing uuid
        :param name:            drawing name
        :param room_uuid:       room uuid
        :param lines:           list of drawn lines
        :return:                drawing instance
        """
        model = cls(room_uuid)
        model.uuid = uuid
        model.name = name
        model.lines = lines

        return model

    async def reset(self):
        """
        Resets the drawing by cleaning the drawn lines

        :return:        None
        """
        self.logger.debug(f"resetting {self.TYPE} {self}")
        self.lines = []
        await self.storage.put(self)

    async def add_line(self, line: Line):
        """
        Adds a drawn line

        :param line:        line model instance
        :return:            None
        """
        self.logger.debug(f"adding {line} to {self}")
        self.lines.append(line)
        await self.storage.put(self)

    async def change(self):
        """
        Drawing change is not implemented

        :return: None
        """
        raise NotImplementedError

    def get_dict(self) -> dict:
        """
        Dictionary representation with uuid, name and lines

        :return:            dictionary representation
        """
        return {
            "uuid": self.uuid,
            "name": self.name,
            "lines": [line.get_dict() for line in self.lines]
        }
