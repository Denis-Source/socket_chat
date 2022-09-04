import logging

from server.server import Server

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format="%(module)s %(message)s")

    Server().run()
