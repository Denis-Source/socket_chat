from typing import Union

import models
from models.model_types import ModelTypes
from storage.abstract_storage import AbstractStorage


class BaseStorage(AbstractStorage):
    NAME = "base storage"

    def __init__(self):
        self._get_methods = {
            ModelTypes.USER: self._get_user,
            ModelTypes.ROOM: self._get_room,
            ModelTypes.MESSAGE: self._get_message,
            ModelTypes.DRAWING: self._get_drawing,
        }
        self._list_methods = {
            ModelTypes.ROOM: self._list_rooms
        }
        self._put_methods = {
            ModelTypes.USER: self._put_user,
            ModelTypes.ROOM: self._put_room,
            ModelTypes.MESSAGE: self._put_message,
            ModelTypes.DRAWING: self._put_drawing,
            ModelTypes.LINE: self._put_line,
        }
        self._delete_methods = {
            ModelTypes.USER: self._delete_user,
            ModelTypes.ROOM: self._delete_room,
        }

    def __str__(self):
        return self.NAME

    @staticmethod
    async def prepare():
        pass

    async def get(self, model_type: ModelTypes, uuid: str) -> \
            Union["models.user.User", "models.room.Room",
                  "models.message.Message", "models.drawing.Drawing"]:
        try:
            return await self._get_methods[model_type](uuid)
        except KeyError:
            raise NotImplementedError

    async def _get_room(self, uuid: str) -> "models.room.Room":
        raise NotImplementedError

    async def _get_user(self, uuid: str) -> "models.user.User":
        raise NotImplementedError

    async def _get_message(self, uuid: str) -> "models.message.Message":
        raise NotImplementedError

    async def _get_drawing(self, uuid: str) -> "models.drawing.Drawing":
        raise NotImplementedError

    async def list(self, model_type: ModelTypes):
        try:
            return await self._list_methods[model_type]()
        except KeyError:
            raise NotImplementedError

    async def _list_rooms(self):
        raise NotImplementedError

    async def put(self, model: Union[
        "models.user.User", "models.room.Room",
        "models.message.Message", "models.drawing.Drawing"]):
        try:
            return await self._put_methods[model.TYPE](model)
        except KeyError:
            raise NotImplementedError

    async def _put_user(self, user: "models.user.User"):
        raise NotImplementedError

    async def _put_room(self, room: "models.room.Room"):
        raise NotImplementedError

    async def _put_message(self, message: "models.message.Message"):
        raise NotImplementedError

    async def _put_drawing(self, drawing: "models.drawing.Drawing"):
        raise NotImplementedError

    async def _put_line(self, line: "models.line.Line"):
        raise NotImplementedError

    async def delete(self, model: Union[
        "models.user.User", "models.room.Room",
        "models.message.Message", "models.drawing.Drawing"]):
        try:
            await self._delete_methods[model.TYPE](model)
        except KeyError:
            raise NotImplementedError

    async def _delete_user(self, user: "models.user.User"):
        raise NotImplementedError

    async def _delete_room(self, room: "models.room.Room"):
        raise NotImplementedError

    @staticmethod
    async def close():
        pass
