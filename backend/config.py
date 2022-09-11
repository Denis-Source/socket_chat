from logging import DEBUG, INFO

from storage.alchemy_storage.alchemy_storage import AlchemyStorage


class Config:
    IP = "127.0.0.1"
    PORT = 9000

    STORAGE_CLS = AlchemyStorage

    LOGGING_LEVEL = DEBUG
    LOGGING_FORMAT = "%(asctime)s\t%(levelname)-7s\t%(name)-16s\t%(message)s"

    LOGGING_QUITES = [AlchemyStorage.NAME, "aiosqlite", "websockets"]
    LOGGING_QUITES_LEVEL = INFO

    MAX_STATEMENT_SIZE = 1e5
