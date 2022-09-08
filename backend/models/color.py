import re
from logging import getLogger

from models.model_types import ModelTypes


class ColorException(Exception):
    """
    Raised if the color is not valid
    """
    pass


class Color:
    """
    Color Model

    Should be initialized with a hexadecimal value e.g:
        #ffffff
        #1278DE

    Attributes:
        value:  color hexadecimal value
    """
    COLOR_RE = r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$"
    TYPE = ModelTypes.COLOR

    logger = getLogger(TYPE)

    def __init__(self, value):
        if self.check_color(value):
            self.value = value
            self.logger.debug(f"Created {self}")
        else:
            raise ColorException(f"{value} is not a valid color")

    def __str__(self):
        return self.value

    @staticmethod
    def check_color(color: str) -> bool:
        """
        Checks whether the color value is valid

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
