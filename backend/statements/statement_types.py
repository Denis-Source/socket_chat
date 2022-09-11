from enum import Enum


class StatementTypes(str, Enum):
    """
    Server statements can be categorized in three types:
        call that tells the server what to do
        result that tells the client what to do
        and error
    """
    CALL = "call"
    RESULT = "result"
    ERROR = "error"
