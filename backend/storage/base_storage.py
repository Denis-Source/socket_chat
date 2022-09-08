from abc import ABC, abstractmethod
from typing import List, Tuple

from websockets.legacy.server import WebSocketServerProtocol

from models.drawing import Drawing
from models.line import Line
from models.message import Message
from models.room import Room
from models.user import User


class BaseStorage(ABC):
    @abstractmethod
    async def init(self):
        raise NotImplementedError

    @abstractmethod
    async def create_user(self) -> User:
        raise NotImplementedError

    @abstractmethod
    async def get_user(self, uuid) -> User:
        raise NotImplementedError

    @abstractmethod
    async def delete_user(self, user: User):
        raise NotImplementedError

    @abstractmethod
    async def change_user(self, user: User, name: str = None):
        raise NotImplementedError

    @abstractmethod
    async def list_users(self) -> List[User]:
        raise NotImplementedError

    @abstractmethod
    async def get_room(self, uuid: str) -> Room:
        raise NotImplementedError

    @abstractmethod
    async def enter_room(self, room: Room, user: User) -> Tuple[Room, Room]:
        raise NotImplementedError

    @abstractmethod
    async def leave_room(self, user: User) -> Room:
        raise NotImplementedError

    @abstractmethod
    async def list_rooms(self) -> List[Room]:
        raise NotImplementedError

    @abstractmethod
    async def delete_room(self, room: Room):
        raise NotImplementedError

    @abstractmethod
    async def create_room(self) -> Room:
        raise NotImplementedError

    @abstractmethod
    async def change_room(self, room: Room, color: str = None, name: str = None) -> Room:
        raise NotImplementedError

    @abstractmethod
    async def get_drawing(self, room: Room) -> Drawing:
        raise NotImplementedError

    @abstractmethod
    async def reset_drawing(self, room: Room):
        raise NotImplementedError

    @abstractmethod
    async def change_drawing(self, drawing: Drawing, line: Line) -> Drawing:
        raise NotImplementedError

    @abstractmethod
    async def create_message(self, body: str, room: Room, user: User) -> Message:
        raise NotImplementedError

    @abstractmethod
    async def list_messages(self, room: Room) -> List[Message]:
        raise NotImplementedError
