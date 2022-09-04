from logging import getLogger
from typing import List

from models.base_model import BaseModel
from models.model_types import ModelTypes


class Line(BaseModel):
    TYPE = ModelTypes.DRAWING
    logger = getLogger(f"{TYPE} model")

    def __init__(self, color, tool, points, uuid):
        super().__init__()
        self.uuid = uuid
        self.tool = tool
        self.color = color
        self.points = points
        self.name = f"{self.TYPE}-{self.uuid}"

    def __str__(self):
        return self.name

    def get_dict(self):
        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
            "points": self.points,
            "tool": self.tool,
            "color": self.color
        }


class Drawing(BaseModel):
    TYPE = ModelTypes.DRAWING
    logger = getLogger(f"{TYPE} model")

    def __init__(self):
        super().__init__()
        self.lines = {}
        self.name = f"{self.TYPE}-{self.get_uuid()}"

    def __str__(self):
        return self.name

    def add_line(self, line: Line):
        self.lines[line.uuid] = line

    def update_line(self, uuid: str, points: str):
        self.lines[uuid].points = points

    def reset(self):
        self.lines = {}

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
            "lines": [line.get_dict() for _, line in self.lines.items()]
        }
