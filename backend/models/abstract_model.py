from abc import ABC, abstractmethod


class AbstractModel(ABC):
    @classmethod
    @abstractmethod
    def from_data(cls, **kwargs):
        pass

    @classmethod
    @abstractmethod
    async def create(cls, **kwargs):
        pass

    @abstractmethod
    async def list(self):
        pass

    @classmethod
    @abstractmethod
    async def get(cls, uuid: str):
        pass

    @classmethod
    @abstractmethod
    async def delete(cls, uuid: str):
        pass

    @abstractmethod
    async def change(self, **kwargs):
        pass

    @abstractmethod
    def get_dict(self) -> dict:
        pass
