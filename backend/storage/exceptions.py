from ctypes import Union

from models.drawing import Drawing
from models.line import Line
from models.model_types import ModelTypes
from models.room import Room
from models.user import User


class NotSpecifiedException(Exception):
    def __init__(self, uuid: str, _type: ModelTypes):
        self.uuid = uuid
        self.type = _type

    def __str__(self):
        return f"{self.type} not found with {self}"
