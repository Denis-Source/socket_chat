from logging import DEBUG, INFO

from storage.memory_storage import MemoryStorage
from storage.alchemy_storage import AlchemyStorage


class Config:
    IP = "127.0.0.1"
    PORT = 9000

    STORAGE_CLS = MemoryStorage

    # ALCHEMY_ENGINE = "sqlite:///test.db"

    LOGGING_LEVEL = INFO
    LOGGING_FORMAT = "%(asctime)s\t%(levelname)-7s\t%(name)-8s\t%(message)s"
