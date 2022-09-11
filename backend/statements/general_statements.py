from enum import Enum


class GeneralStatements(str, Enum):
    OK = "ok"

    BAD_DATA = "bad_data"
    DATA_TOO_LONG = "data_too_long"
    NOT_SUFFICIENT_DATA = "not_sufficient_data"
