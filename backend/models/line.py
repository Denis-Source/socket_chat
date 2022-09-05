from enum import Enum
from logging import getLogger
from typing import List

from models.base_model import BaseModel
from models.color import Color
from models.model_types import ModelTypes


class Tools(str, Enum):
    ERASER = "eraser"
    PEN = "pen"


class Line(BaseModel):
    """
    Line model

    Inherits Base model
    Overwrites built in uuid generation,
    as it could be generated else where

    Attributes:
        tool:       tool, that was used to draw a line
        color:      color of the drawn line
        points:     list of coordinates of the drawn line
        name:       name of the line
    """
    TYPE = ModelTypes.LINE
    logger = getLogger(f"{TYPE} model")

    def __init__(
            self,
            color: Color,
            tool: Tools,
            points: List[float], uuid: str = None
    ):
        super().__init__()
        self.tool = tool
        self.color = color
        self.points = points
        self.name = f"{self.TYPE}-{self.get_uuid()}"
        if uuid:
            self._uuid = uuid

    def __str__(self):
        return self.name

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
            "points": self.points,
            "tool": self.tool,
            "color": self.color
        }
