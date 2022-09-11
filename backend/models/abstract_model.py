from abc import ABC, abstractmethod


class AbstractModel(ABC):
    """
    Model abstract class

    Model should rely on repo class

    All methods should be asynchronous as some storage solutions (repo)
    that the model relies on are asynchronous

    All models should have TYPE field to be accessed by the repo

    All models instances should have unique attribute (uuid)
    """

    @classmethod
    @abstractmethod
    def from_data(cls, **kwargs):
        """
        Class method to construct model from the provided data

        :param kwargs:      dictionary of params
        :return:            model instance
        """
        pass

    @classmethod
    @abstractmethod
    async def create(cls, **kwargs):
        """
        Class method to create a model

        This method is purely a workaround of a synchronous
        __init__() method as it can only be synchronous
        The method should be called instead of the default constructor
        as it saves the model in the asynchronous repo

        The difference between from_data() is that it generates unique data
        (uuid for example), the from_data() does not

        :param kwargs:      dictionary of params
        :return:            model instance
        """
        pass

    @abstractmethod
    async def list(self):
        """
        Should return the list of all of the created model instances

        :return:        list of model instances
        """
        pass

    @classmethod
    @abstractmethod
    async def get(cls, uuid: str):
        """
        Should get model instance from the repo by the unique uuid

        :param uuid:        uuid string
        :return:            model instance
        """
        pass

    @classmethod
    @abstractmethod
    async def delete(cls, uuid: str):
        """
        Should delete model instance from the repo

        Note that the instance itself may not be deleted

        :param uuid:        uuid string
        :return:            None
        """
        pass

    @abstractmethod
    async def change(self, **kwargs):
        """
        Should make some changes to the model instance

        Should also save those changes in the repo

        :param kwargs:      dictionary of params
        :return:            None
        """
        pass

    @abstractmethod
    def get_dict(self) -> dict:
        """
        Should return dictionary representation of the model instance

        :return:        dictionary representation
        """
        pass
