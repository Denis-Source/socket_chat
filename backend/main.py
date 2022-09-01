import logging

from server.server import Server

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format="%(module)s %(message)s")

    Server().run()
