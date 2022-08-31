from enum import Enum


class ModelTypes(str, Enum):
    MESSAGE = "message"
    USER = "user"
    ROOM = "room"
    ROOM_COLOR = "room_color"
    CHAT = "chat"
