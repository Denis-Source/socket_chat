import logging

from config import Config
from server.server import Server

if __name__ == '__main__':
    logging.basicConfig(
        level=Config.LOGGING_LEVEL,
        format=Config.LOGGING_FORMAT
    )

    Server().run()
