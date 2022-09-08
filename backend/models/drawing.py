from logging import getLogger
from typing import List

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

    def __init__(self, uuid=None):
        super().__init__(uuid)
        self.lines: List[Line] = []
        self.name = f"{self.TYPE}-{self.uuid}"

    def __str__(self):
        return self.name

    def add_line(self, line: Line):
        """
        Adds a new line to the drawing

        :param line:    new Line
        :return:        None
        """
        self.logger.debug(f"Adding {line} to {self}")
        self.lines.append(line)

    def reset(self):
        """
        Resets drawing
        :return:
        """
        self.logger.debug(f"Resetting {self}")
        self.lines = []

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": self.uuid,
            "name": self.name,
            "lines": [line.get_dict() for line in self.lines]
        }
