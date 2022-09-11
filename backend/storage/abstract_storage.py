from abc import ABC, abstractmethod

from models.model_types import ModelTypes


class AbstractStorage(ABC):
    """
    Storage abstract class

    Implements repository pattern

    Storage should rely on model instance uuid
    Should manage model get, delete, put and list methods
    All methods should be asynchronous as some storage solutions requires it
    """

    @staticmethod
    @abstractmethod
    async def prepare():
        """
        Should implement some initial preparations of the storage

        :return:        None
        """
        pass

    @abstractmethod
    async def list(self, model_type: ModelTypes):
        """
        Should list all of the model instances of the specified type

        :param model_type:          model type
        :return:                    list of model instances
        """
        pass

    @abstractmethod
    async def get(self, model_type: ModelTypes, uuid: str):
        """
        Should get model instanced based on type and uuid

        :param model_type:          model type
        :param uuid:                uuid string
        :return:                    model instance

        :raises NotFoundException:
        """
        pass

    @abstractmethod
    async def put(self, model):
        """
        Should put model in the storage

        :param model:       model type
        :return:            None
        """
        pass

    @abstractmethod
    async def delete(self, model):
        """
        Should delete the model from the storage

        :param model:       model type
        :return:            None
        """
        pass

    @staticmethod
    @abstractmethod
    async def close():
        """
        Should finalize the storage

        :return:        None
        """
        pass
