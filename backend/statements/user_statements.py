from enum import Enum


class UserCallStatements(str, Enum):
    CHANGE_USER_NAME = "change_user_name"


class UserResultStatements(str, Enum):
    USER_CREATED = "user_created"
    USER_NAME_CHANGED = "user_name_changed"


class UserErrorStatements(str, Enum):
    NO_SPECIFIED_USER = "no specified_user"
