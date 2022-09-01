from enum import Enum


class RoomCallStatements(str, Enum):
    CREATE_ROOM = "create_room"
    ENTER_ROOM = "enter_room"
    LEAVE_ROOM = "leave_room"
    DELETE_ROOM = "delete_room"
    LIST_ROOMS = "list_rooms"
    CHANGE_COLOR = "change_color"
    CHANGE_NAME = "change_name"


class RoomResultStatements(str, Enum):
    ROOM_CREATED = "room_created"
    ROOM_ENTERED = "room_entered"
    ROOM_LEFT = "room_left"
    ROOM_DELETED = "room_deleted"
    ROOMS_LISTED = "rooms_listed"
    ROOM_COLOR_CHANGED = "room_color_changed"
    ROOM_NAME_CHANGED = "room_name_changed"
    ROOM_USER_ENTERED = "room_user_entered"
    ROOM_USER_LEFT = "room_user_left"
    ROOM_USERS_CHANGED = "room_users_changed"


class RoomErrorStatements(str, Enum):
    NO_SPECIFIED_ROOM = "no_specified_room"
    NOT_VALID_COLOR = "not_valid_color"
    NOT_EMPTY_ROOM = "not_empty_room"

