from logging import DEBUG, INFO

from storage.alchemy_storage.alchemy_storage import AlchemyStorage


class Config:
    # Server IP address and port
    IP = "127.0.0.1"
    PORT = 9000

    # Repo storage class
    STORAGE_CLS = AlchemyStorage

    # Logging
    LOGGING_LEVEL = DEBUG
    LOGGING_FORMAT = "%(asctime)s\t%(levelname)-7s\t%(name)-16s\t%(message)s"

    # Special logging modules to have a different level
    LOGGING_QUITES = [AlchemyStorage.NAME, "aiosqlite", "websockets"]
    LOGGING_QUITES_LEVEL = INFO

    # Length limit of a parsable message
    MAX_STATEMENT_SIZE = 1e5
