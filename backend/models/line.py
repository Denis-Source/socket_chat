from sqlalchemy import Enum

from models.base_model import BaseModel
from models.color import Color
from models.model_types import ModelTypes


class Tools(str, Enum):
    """
    Enumeration of the available tools
    """
    ERASER = "eraser"
    PEN = "pen"


class Line(BaseModel):
    """
    Line model class

    Inherits BaseModel, represents a drawn line on the drawing
    Is connected to the drawing by uuid

    Attributes:
        tool:           the tool that was used to draw a line
        color:          the color of the line
        points:         list of points coordinates
        drawing_uuid:   drawing uuid that the line is connected to
    """
    TYPE = ModelTypes.LINE

    def __init__(self, uuid, color, tool, points, drawing_uuid):
        super().__init__()
        self.uuid = uuid
        self.tool = tool
        self.color = color
        self.points = points
        self.drawing_uuid = drawing_uuid

    @classmethod
    def from_data(cls, uuid, drawing_uuid, color, tool, points):
        """
        Constructs the line instance from the provided data

        :param uuid:            the line uuid
        :param tool:            the tool that was used to draw a line
        :param color:           the color of the line
        :param points:          list of points coordinates
        :param drawing_uuid:    drawing uuid that the line is connected to
        :return:                line instance
        """
        model = cls(uuid, color, tool, points, drawing_uuid)
        return model

    @classmethod
    async def create(cls, uuid, drawing, color, tool: Tools, points):
        """
        Creates the line instance

        The uuid should be provided as it generates from the front end
        :param uuid:            uuid of the line
        :param tool:            the tool that was used to draw a line
        :param color:           the color of the line
        :param points:          list of points coordinates
        :param drawing:         drawing instance that the line is connected to
        :return:                model instance
        """
        color = Color(color).value
        model = cls(
            uuid=uuid,
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
        """
        Line change is not implemented

        :return: None
        """
        raise NotImplementedError

    def get_dict(self) -> dict:
        """
        Dictionary representation with uuid, name, points, tool and color

        :return:            dictionary representation
        """
        return {
            "uuid": self.uuid,
            "name": self.name,
            "points": self.points,
            "tool": self.tool,
            "color": self.color
        }
