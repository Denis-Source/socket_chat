import logging

from config import Config
from server.server import Server

if __name__ == '__main__':
    logging.basicConfig(
        level=Config.LOGGING_LEVEL,
        format=Config.LOGGING_FORMAT
    )

    for module in Config.LOGGING_QUITES:
        logging.getLogger(module).setLevel(Config.LOGGING_QUITES_LEVEL)

    Server().run()
