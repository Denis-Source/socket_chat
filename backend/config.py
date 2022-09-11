from logging import DEBUG, INFO

from storage.alchemy_storage.alchemy_storage import AlchemyStorage
from storage.memory_storage import MemoryStorage


class Config:
    IP = "127.0.0.1"
    PORT = 9000

    # STORAGE_CLS = MemoryStorage

    STORAGE_CLS = AlchemyStorage

    # ALCHEMY_ENGINE = "sqlite:///test.db"

    LOGGING_LEVEL = DEBUG
    LOGGING_FORMAT = "%(asctime)s\t%(levelname)-7s\t%(name)-16s\t%(message)s"
