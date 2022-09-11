from models.base_model import BaseModel
from models.line import Line
from models.model_types import ModelTypes


class Drawing(BaseModel):
    TYPE = ModelTypes.DRAWING

    def __init__(self, room_uuid):
        super().__init__()
        self.lines = []
        self.room_uuid = room_uuid

    @classmethod
    async def create(cls, room_uuid, **kwargs):
        model = cls(room_uuid)
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    @classmethod
    def from_data(cls, uuid, name, room_uuid, lines, **kwargs):
        model = cls(room_uuid)
        model.uuid = uuid
        model.name = name
        model.lines = lines

        return model

    async def reset(self):
        self.logger.debug(f"resetting {self.TYPE} {self}")
        self.lines = []
        await self.storage.put(self)

    async def add_line(self, line: Line):
        self.logger.debug(f"adding {line} to {self}")
        self.lines.append(line)
        await self.storage.put(self)

    async def change(self, **kwargs):
        raise NotImplementedError

    def get_dict(self) -> dict:
        return {
            "name": self.name,
            "lines": [line.get_dict() for line in self.lines]
        }
