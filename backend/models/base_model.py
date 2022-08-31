from abc import ABC, abstractmethod
from datetime import datetime
from uuid import uuid4


class BaseModel(ABC):
    def __init__(self):
        self._created = datetime.now()
        self._uuid = uuid4()

    def get_iso_created(self) -> str:
        return self._created.isoformat()

    def get_uuid(self) -> str:
        return str(self._uuid)

    @abstractmethod
    def get_dict(self) -> dict:
        pass
