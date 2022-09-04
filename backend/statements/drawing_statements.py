from enum import Enum


class DrawingCallStatements(str, Enum):
    GET_DRAWING = "get_drawing"
    CHANGE_DRAW_LINE = "change_draw_line"
    RESET_DRAWING = "reset_drawing"


class DrawingResultStatements(str, Enum):
    DRAWING_GOT = "drawing_got"
    DRAW_LINE_CHANGED = "draw_line_changed"


class DrawingErrorStatements(str, Enum):
    NO_SELECTED_ROOM = "no_selected_room"
