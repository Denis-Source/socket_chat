from logging import getLogger
from uuid import uuid4

from config import Config
from models.abstract_model import AbstractModel
from models.model_types import ModelTypes


class BaseModel(AbstractModel):
    TYPE = ModelTypes.BASE
    logger = getLogger(TYPE)
    storage = Config.STORAGE_CLS()

    def __init__(self):
        self.uuid = str(uuid4())
        self.name = f"{self.TYPE}-{self.uuid}"

    def __str__(self):
        return self.name

    @classmethod
    def from_data(cls, **kwargs):
        raise NotImplementedError

    @classmethod
    async def create(cls, **kwargs):
        model = cls()
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    @classmethod
    async def list(cls):
        cls.logger.debug(f"getting list of {cls.TYPE}")
        return await cls.storage.list(cls.TYPE)

    @classmethod
    async def get(cls, uuid: str):
        cls.logger.debug(f"getting {cls.TYPE} ({uuid})")
        return await cls.storage.get(cls.TYPE, uuid)

    @classmethod
    async def delete(cls, model):
        cls.logger.debug(f"deleting {cls.TYPE} ({model.uuid})")
        await cls.storage.delete(model)

    async def change(self, **kwargs):
        raise NotImplementedError

    def get_dict(self) -> dict:
        raise NotImplementedError
