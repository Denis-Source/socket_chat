from enum import Enum


class MessageCallStatements(str, Enum):
    CREATE_MESSAGE = "create_message"
    LIST_MESSAGES = "list_messages"


class MessageResultStatements(str, Enum):
    MESSAGE_CREATED = "message_created"
    MESSAGES_LISTED = "messages_listed"


class MessageErrorStatements(str, Enum):
    NO_SELECTED_ROOM = "no_selected_room"
