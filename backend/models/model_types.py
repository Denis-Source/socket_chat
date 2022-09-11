from enum import Enum


class ModelTypes(str, Enum):
    """
    Enumeration of the available model types
    """
    BASE = "base"
    MESSAGE = "message"
    USER = "user"
    ROOM = "room"
    COLOR = "color"
    CHAT = "chat"
    DRAWING = "drawing"
    LINE = "line"
