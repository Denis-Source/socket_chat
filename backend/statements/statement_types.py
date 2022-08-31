from enum import Enum


class StatementTypes(str, Enum):
    CALL = "call"
    RESULT = "result"
    ERROR = "error"
