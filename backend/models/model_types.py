from enum import Enum


class ModelTypes(str, Enum):
    BASE = "base"
    MESSAGE = "message"
    USER = "user"
    ROOM = "room"
    COLOR = "color"
    CHAT = "chat"
    DRAWING = "drawing"
    LINE = "line"
