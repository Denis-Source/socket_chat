import logging

from server.server import Server

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format="%(message)s")

    Server().run()
