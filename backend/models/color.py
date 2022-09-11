import re
from logging import getLogger

from models.model_types import ModelTypes


class NotValidColorException(Exception):
    """
    Not valid color Exception should be raised if the color value
    is not of hexadecimal RGB of RGBA format

    Attributes:
        value           color value that is not of RGB or RGBA format
    """

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return f"{self.value} is not a valid {ModelTypes.COLOR}"


class Color:
    """
    Color Model

    Should be initialized with a hexadecimal value e.g:
        #ffffff
        #1278DE

    Attributes:
        value:          string value
    """
    COLOR_RE = r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$"
    TYPE = ModelTypes.COLOR

    logger = getLogger(TYPE)

    def __init__(self, value):
        if self.check_color(value):
            self.value = value
        else:
            raise NotValidColorException(f"{value} is not a valid color")

    def __str__(self):
        return self.value

    @staticmethod
    def check_color(color: str) -> bool:
        """
        Checks whether the color value is RGB or RGBA format

        :param color:   color value
        :return:        value validity
        """

        Color.logger.debug(f"Checking color {color}")
        color_re = re.compile(Color.COLOR_RE)
        if color_re.match(color):
            Color.logger.debug(f"Color {color} is valid")
            return True
        Color.logger.debug(f"Color {color} is not valid")
        return False
