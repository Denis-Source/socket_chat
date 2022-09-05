from logging import getLogger

from models.base_model import BaseModel
from models.line import Line
from models.model_types import ModelTypes


class Drawing(BaseModel):
    """
    Drawing Model

    Inherits from BaseModel
    Attributes:
        lines: list of drawn lines
    """

    TYPE = ModelTypes.DRAWING
    logger = getLogger(f"{TYPE} model")

    def __init__(self):
        super().__init__()
        self.lines = {}
        self.name = f"{self.TYPE}-{self.get_uuid()}"

    def __str__(self):
        return self.name

    def add_line(self, line: Line):
        """
        Adds a new line to the drawing

        :param line:    new Line
        :return:        None
        """
        self.logger.debug(f"Adding {line} to {self}")
        self.lines[line.get_uuid()] = line

    def update_line(self, uuid: str, points: str):
        """
        Updates line points
        :param uuid:        Line uuid
        :param points:      new points
        :return:
        """
        self.logger.debug(f"Adding points to {self}")
        self.lines[uuid].points = points

    def reset(self):
        """
        Resets drawing
        :return:
        """
        self.logger.debug(f"Resetting {self}")
        self.lines = {}

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": str(self.get_uuid()),
            "name": self.name,
            "lines": [line.get_dict() for _, line in self.lines.items()]
        }
