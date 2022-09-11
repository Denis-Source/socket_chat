from sqlalchemy import Enum

from models.base_model import BaseModel
from models.color import Color
from models.model_types import ModelTypes


class Tools(str, Enum):
    ERASER = "eraser"
    PEN = "pen"


class Line(BaseModel):
    TYPE = ModelTypes.LINE

    def __init__(self, color, tool, points, drawing_uuid):
        super().__init__()
        self.tool = tool
        self.color = color
        self.points = points
        self.drawing_uuid = drawing_uuid

    @classmethod
    def from_data(cls, drawing_uuid, color, tool, points, **kwargs):
        model = cls(color, tool, points, drawing_uuid)
        return model

    @classmethod
    async def create(cls, uuid, drawing, color, tool: Tools, points, **kwargs):
        color = Color(color).value
        model = cls(
            drawing_uuid=drawing.uuid,
            color=color,
            tool=tool,
            points=points
        )
        model.uuid = uuid
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)

        return model

    async def change(self, **kwargs):
        raise NotImplementedError

    def get_dict(self) -> dict:
        return {
            "uuid": self.uuid,
            "name": self.name,
            "points": self.points,
            "tool": self.tool,
            "color": self.color
        }
