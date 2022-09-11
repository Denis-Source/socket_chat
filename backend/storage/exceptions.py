from models.model_types import ModelTypes


class NotFoundException(Exception):
    def __init__(self, uuid: str, _type: ModelTypes):
        self.uuid = uuid
        self.type = _type

    def __str__(self):
        return f"{self.type} not found with {self}"
