from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Union

import models
from models.model_types import ModelTypes


class AbstractStorage(ABC):
    @staticmethod
    @abstractmethod
    async def prepare():
        pass

    @abstractmethod
    async def list(self, model_type: ModelTypes):
        pass

    @abstractmethod
    async def get(self, model_type: ModelTypes, uuid: str):
        pass

    @abstractmethod
    async def put(self, model: Union["models.user.User"]):
        pass

    @abstractmethod
    async def delete(self, model: Union["models.user.User"]):
        pass

    @staticmethod
    @abstractmethod
    async def close():
        pass
