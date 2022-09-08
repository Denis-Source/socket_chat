from abc import ABC, abstractmethod
from datetime import datetime
from uuid import uuid4


class BaseModel(ABC):
    """
    Model abstract method

    Implements date and uuid generation
    """
    def __init__(self, uuid=None, created=None):
        if not created:
            self.created = datetime.now().isoformat()
        else:
            self.created = created

        if uuid:
            self.uuid = uuid
        else:
            self.uuid = str(uuid4())

    @abstractmethod
    def get_dict(self) -> dict:
        """
        Should be implemented
        to have the ability to be serialized in JSON format
        :return:
        """
        pass
