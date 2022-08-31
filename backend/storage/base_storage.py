from abc import ABC, abstractmethod

from models.room import Room


class NoRoomSpecifiedException(Exception):
    pass


class BaseStorage(ABC):
    @abstractmethod
    def store_room(self, room: Room):
        pass

    @abstractmethod
    def get_room(self, uuid: str):
        pass

    @abstractmethod
    def list_rooms(self):
        pass

    @abstractmethod
    def delete_room(self, uuid: str):
        pass
