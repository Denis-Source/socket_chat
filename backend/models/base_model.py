from logging import getLogger
from uuid import uuid4

from config import Config
from models.abstract_model import AbstractModel
from models.model_types import ModelTypes


class BaseModel(AbstractModel):
    """
    Base model class

    Inherits Abstract model
    Implements base functionality such as uuid and name generation
    Implements logger and loads storage (repo) class specified in the configs

    Attributes:
        uuid:       unique string attribute
        name:       basic model name
    """
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
        """
        Raises NotImplemented, as all of the models should implement it themselves

        :param kwargs:      dictionary of params
        :return:            model instance

        :raises NotImplementedError:
        """
        raise NotImplementedError

    @classmethod
    async def create(cls, **kwargs):
        """
        Creates a model instance without using params

        After the creation, puts the model in the repo

        :param kwargs:      dictionary of params
        :return:            model instance
        """
        model = cls()
        cls.logger.debug(f"created {model}")
        await cls.storage.put(model)
        return model

    @classmethod
    async def list(cls):
        """
        Lists model instances, stored in the repo

        :return:        list of model instances
        """
        cls.logger.debug(f"getting list of {cls.TYPE}")
        return await cls.storage.list(cls.TYPE)

    @classmethod
    async def get(cls, uuid: str):
        """
        Gets the model instance from the repo

        :param uuid:        uuid string that identifies the model
        :return:            model instance
        """
        cls.logger.debug(f"getting {cls.TYPE} ({uuid})")
        return await cls.storage.get(cls.TYPE, uuid)

    @classmethod
    async def delete(cls, model):
        """
        Deletes the model instance from the repo

        Does not deletes the model instance itself
        :param model:       model instance to delete from the repo
        :return:            None
        """
        cls.logger.debug(f"deleting {cls.TYPE} ({model.uuid})")
        await cls.storage.delete(model)

    async def change(self, **kwargs):
        """
        Model instance change method
        should be implemented by models themselves

        :param kwargs:      dictionary of params
        :return:            None
        """
        raise NotImplementedError

    def get_dict(self) -> dict:
        """
        Model instance dictionary representation
        should be implemented by models themselves

        :return:            dictionary representation
        """
        raise NotImplementedError
