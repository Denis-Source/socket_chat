import json
from logging import getLogger
from typing import Union

from statements import statement_types, \
    drawing_statements, general_statements, \
    message_statements, room_statements, \
    user_statements


def prepare_statement(type: statement_types.StatementTypes,
                      message: Union[
                          general_statements.GeneralStatements,

                          drawing_statements.DrawingCallStatements,
                          drawing_statements.DrawingResultStatements,
                          drawing_statements.DrawingErrorStatements,

                          message_statements.MessageCallStatements,
                          message_statements.MessageResultStatements,
                          message_statements.MessageErrorStatements,

                          room_statements.RoomCallStatements,
                          room_statements.RoomResultStatements,
                          room_statements.RoomErrorStatements,

                          user_statements.UserResultStatements,
                          user_statements.UserCallStatements,
                          user_statements.UserErrorStatements
                      ],
                      **kwargs
                      ) -> str:
    """
    Constructs the message into the correct form
    Return in the serialized JSON from

    :param type:        statement type
    :param message:     statement message
    :param kwargs:      additional arguments
    :return:
    """
    LOGGER_NAME = "stat_const"

    payload = {
        "message": message
    }
    payload.update(kwargs)
    statement = {
        "type": type,
        "payload": payload
    }
    getLogger(LOGGER_NAME).debug(f"Constructed statement for {message}")

    return json.dumps(statement)
