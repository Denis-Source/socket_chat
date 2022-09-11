import json
from json import JSONDecodeError
from logging import getLogger
from typing import Union, Tuple

from config import Config
from statements import drawing_statements, general_statements, \
    message_statements, room_statements, user_statements
from statements.statement_types import StatementTypes


class ConvolutedStatementException(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return f"Convoluted Statement provided: {self.message}"


class Utils:
    """
    Server utils class

    Implements statement parser, constructor and validators
    """
    NAME = "utils"
    logger = getLogger(NAME)

    @staticmethod
    def validate_len(statement: str):
        """
        Validates whether the statement is less than limit specified in the configs

        :raises ConvolutedStatementException:
        """
        if len(statement) > Config.MAX_STATEMENT_SIZE:
            raise ConvolutedStatementException(
                general_statements.GeneralStatements.DATA_TOO_LONG)

    @staticmethod
    def parse_statement(statement: str) -> Tuple[
        Union[
            drawing_statements.DrawingCallStatements,
            message_statements.MessageCallStatements,
            room_statements.RoomCallStatements,
            user_statements.UserCallStatements
        ],
        dict
    ]:
        """
        Parses and validates statement
        :param statement:           statement string
        :return:                    tuple of statement message and payload dictionary
        """
        Utils.logger.debug(f"parsing statement ({len(statement)})")

        Utils.validate_len(statement)

        try:
            memo = json.loads(statement)
            payload = memo["payload"]
            memo_type = payload["message"]
            Utils.logger.debug(f"parsed statement")

            return memo_type, payload
        except KeyError:
            raise ConvolutedStatementException(
                general_statements.GeneralStatements.NOT_SUFFICIENT_DATA)
        except JSONDecodeError:
            raise ConvolutedStatementException(
                general_statements.GeneralStatements.BAD_DATA)

    @staticmethod
    def prepare_statement(type: StatementTypes,
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
        Constructs a statement into the correct form
        Return in the serialized JSON from

        :param type:        statement type
        :param message:     statement message
        :param kwargs:      additional arguments
        :return:
        """
        payload = {
            "message": message
        }
        payload.update(kwargs)
        statement = {
            "type": type,
            "payload": payload
        }
        Utils.logger.debug(f"Constructed statement for {message}")

        return json.dumps(statement)
