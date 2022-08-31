from logging import getLogger


class Server:
    connected_users = dict()
    NAME = "server"
    logger = getLogger(NAME)
