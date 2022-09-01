from enum import Enum


class RoomCallStatements(str, Enum):
    CREATE_ROOM = "create_room"
    ENTER_ROOM = "enter_room"
    LEAVE_ROOM = "leave_room"
    DELETE_ROOM = "delete_room"
    LIST_ROOMS = "list_rooms"
    CHANGE_ROOM_COLOR = "change_color"
    CHANGE_ROOM_NAME = "change_name"


class RoomResultStatements(str, Enum):
    ROOM_CREATED = "room_created"
    ROOM_ENTERED = "room_entered"
    ROOM_LEFT = "room_left"
    ROOM_DELETED = "room_deleted"
    ROOMS_LISTED = "rooms_listed"
    ROOM_CHANGED = "room_changed"


class RoomErrorStatements(str, Enum):
    NO_SPECIFIED_ROOM = "no_specified_room"
    NOT_VALID_COLOR = "not_valid_color"
    NOT_EMPTY_ROOM = "not_empty_room"

