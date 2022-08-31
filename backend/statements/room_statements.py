from enum import Enum


class RoomCallStatements(str, Enum):
    CREATE_ROOM = "create_room"
    SELECT_ROOM = "select_room"
    LEAVE_ROOM = "leave_room"
    DELETE_ROOM = "delete_room"
    LIST_ROOMS = "list_rooms"
    CHANGE_ROOM_COLOR = "change_room_color"
    CHANGE_ROOM_NAME = "change_room_name"


class RoomResultStatements(str, Enum):
    ROOM_CREATED = "room_created"
    ROOM_SELECTED = "room_selected"
    ROOM_LEFT = "room_left"
    ROOM_DELETED = "room_deleted"
    ROOMS_LISTED = "rooms_listed"
    ROOM_COLOR_CHANGED = "room_color_changed"
    ROOM_NAME_CHANGED = "room_color_changed"


class RoomErrorStatements(str, Enum):
    NO_SPECIFIED_ROOM = "no_specified_room"
    NO_COLOR_PROVIDED = "no_color_provided"
