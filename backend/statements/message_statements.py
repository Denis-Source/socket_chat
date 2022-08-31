from enum import Enum


class MessageCallStatements(str, Enum):
    CREATE_MESSAGE = "create_message"


class MessageResultStatements(str, Enum):
    MESSAGE_CREATED = "message_created"


class MessageErrorStatements(str, Enum):
    pass
