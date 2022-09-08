import pickle
from logging import getLogger
from typing import List, Tuple

from sqlalchemy import Column, Integer, String, ForeignKey, Text, update
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import relationship, selectinload, declarative_base

from models.drawing import Drawing
from models.line import Line
from models.message import Message
from models.room import Room
from models.user import User
from .base_storage import BaseStorage

Base = declarative_base()


class UserDB(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    uuid = Column(String(36))
    room_id = Column(Integer, ForeignKey("room.id"))
    room = relationship("RoomDB", back_populates="users")
    messages = relationship("MessageDB", back_populates="user")

    __mapper_args__ = {'eager_defaults': True}


class RoomDB(Base):
    __tablename__ = "room"

    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    uuid = Column(String(36))
    color = Column(String(9))
    users = relationship("UserDB", back_populates="room")
    messages = relationship("MessageDB", back_populates="room")
    drawing = relationship("DrawingDB", back_populates="room", uselist=False)

    __mapper_args__ = {'eager_defaults': True}


class MessageDB(Base):
    __tablename__ = "message"

    id = Column(Integer, primary_key=True)
    body = Column(Text)
    uuid = Column(String(36))

    user = relationship("UserDB", back_populates="messages")
    user_id = Column(Integer, ForeignKey("user.id"))

    room = relationship("RoomDB", back_populates="messages")
    room_id = Column(Integer, ForeignKey("room.id"))

    __mapper_args__ = {'eager_defaults': True}


class DrawingDB(Base):
    __tablename__ = "drawing"

    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    uuid = Column(String(36))

    room = relationship("RoomDB", back_populates="drawing")
    room_id = Column(Integer, ForeignKey("room.id"))

    lines = relationship("LineDB", back_populates="drawing")

    __mapper_args__ = {'eager_defaults': True}


class LineDB(Base):
    __tablename__ = "line"

    id = Column(Integer, primary_key=True)
    color = Column(String(9))
    tool = Column(String(9))
    name = Column(String(64))
    uuid = Column(String(36))
    points = Column(Text)

    drawing = relationship("DrawingDB", back_populates="lines")
    drawing_id = Column(Integer, ForeignKey("drawing.id"))

    __mapper_args__ = {'eager_defaults': True}


class AlchemyStorage(BaseStorage):
    NAME = "alc_stor"
    logger = getLogger(NAME)

    _engine = create_async_engine(
        "sqlite+aiosqlite:///storage.db",
    )
    _session = AsyncSession(_engine, expire_on_commit=False)

    async def init(self):
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        query = update(UserDB).where(UserDB.room_id > 0).values(room_id=0)
        await self._session.execute(query)
        await self._session.commit()

    async def create_user(self) -> User:
        user = User()
        user_db = UserDB(name=user.name, uuid=user.uuid)
        self._session.add(user_db)
        await self._session.commit()

        return user

    async def get_user(self, uuid) -> User:
        query = select(UserDB).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        user_db = result.first()

        user = User(name=user_db.name, uuid=user_db.uuid)

        return user

    async def delete_user(self, user: User):
        pass

    async def change_user(self, user: User, name: str = None):
        if not name:
            name = user.name

        query = update(UserDB).where(UserDB.uuid == user.uuid).values(name=name)
        await self._session.execute(query)

        user = await self.get_user(user.uuid)
        await self._session.commit()
        return user

    async def list_users(self) -> List[User]:
        pass

    async def get_room(self, uuid: str) -> Room:
        query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        room_db = result.first()
        room = Room(uuid=room_db.uuid, name=room_db.name, color=room_db.color)
        drawing = await self.get_drawing(room)
        room.drawing = drawing
        for user_db in room_db.users:
            room.users.append(User(uuid=user_db.uuid, name=user_db.name))
        return room

    async def enter_room(self, room: Room, user: User) -> Tuple[Room, Room]:
        query = select(UserDB).filter_by(uuid=user.uuid)
        result = await self._session.scalars(query)
        user_db = result.first()

        old_room = None
        if user.room:
            query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=user.room.uuid)
            result = await self._session.scalars(query)
            room_db = result.first()
            room_db.users.remove()
            old_room = self._convert_room(room_db)

        query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=room.uuid)
        result = await self._session.scalars(query)

        room_db = result.first()

        room_db.users.append(user_db)
        user_db.room = room_db
        await self._session.commit()

        new_room = self._convert_room(room_db)
        user.set_room(new_room)

        return old_room, new_room

    def _convert_user(self, user_db: UserDB, rooms=True) -> User:
        user = User(uuid=user_db.uuid, name=user_db.name)
        if rooms:
            if user_db.room:
                user.room = self._convert_room(user_db.room)
        return user

    def _convert_room(self, room_db: RoomDB) -> Room:
        room = Room(name=room_db.name, uuid=room_db.uuid, color=room_db.color)

        for user in room_db.users:
            user = User(uuid=user.uuid, name=user.name)
            user.room = room
            room.users.append(user)
        return room

    async def leave_room(self, user: User) -> Room:
        if user.room:
            query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=user.room.uuid)
            result = await self._session.scalars(query)
            room_db = result.first()

            query = select(UserDB).filter_by(uuid=user.uuid)
            result = await self._session.scalars(query)
            user_db = result.first()

            room_db.users.remove(user_db)
            user_db.room = None

            await self._session.commit()

            room = self._convert_room(room_db)
            user.room = None

            return room

    async def list_rooms(self) -> List[Room]:
        query = select(RoomDB).options(selectinload(RoomDB.users))
        result = await self._session.scalars(query)

        return [self._convert_room(room_db) for room_db in result]

    async def delete_room(self, room: Room):
        query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        await self.reset_drawing(room)

        query = delete(RoomDB).where(RoomDB.uuid == room.uuid)
        await self._session.execute(query)

        query = delete(MessageDB).where(MessageDB.room_id == room_db.id)
        await self._session.execute(query)

        query = delete(DrawingDB).where(DrawingDB.room_id == room_db.id)
        await self._session.execute(query)

        await self._session.commit()

    async def create_room(self) -> Room:
        room = Room()
        room_db = RoomDB(name=room.name, uuid=room.uuid, color=room.color)
        self._session.add(room_db)
        await self._session.commit()

        drawing = Drawing()

        drawing_db = DrawingDB(
            name=drawing.name,
            uuid=drawing.uuid,
            room_id=room_db.id
        )

        self._session.add(drawing_db)
        await self._session.commit()

        return room

    async def change_room(self, room: Room, color: str = None, name: str = None) -> Room:
        if not color:
            color = room.color
        if not name:
            name = room.name

        query = update(RoomDB).where(RoomDB.uuid == room.uuid).values(name=name, color=color)
        await self._session.execute(query)

        room = await self.get_room(room.uuid)
        await self._session.commit()
        return room

    async def get_drawing(self, room: Room) -> Drawing:
        query = select(RoomDB).options(selectinload(RoomDB.drawing)).filter_by(
            uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        drawing = Drawing(uuid=room_db.drawing.uuid)

        query = select(LineDB).filter_by(
            drawing_id=room_db.drawing.id
        )
        result = await self._session.scalars(query)
        line_dbs = result.all()

        for line_db in line_dbs:
            points = pickle.loads(line_db.points.encode())
            drawing.lines.append(
                Line(uuid=line_db.uuid,
                     tool=line_db.tool,
                     color=line_db.color,
                     points=points
                     )
            )
        return drawing

    async def reset_drawing(self, room: Room):
        query = select(RoomDB).options(selectinload(RoomDB.drawing)).filter_by(
            uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        query = delete(LineDB).filter_by(drawing_id=room_db.drawing.id)
        await self._session.execute(query)
        await self._session.commit()

        return room

    async def change_drawing(self, room: Room, line: Line) -> Drawing:
        query = select(RoomDB).filter_by(uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        query = select(DrawingDB).filter_by(room_id=room_db.id)
        result = await self._session.scalars(query)
        drawing_db = result.first()

        points = pickle.dumps(line.points, 0).decode()
        line_db = LineDB(color=line.color, tool=line.tool, name=line.name, uuid=line.uuid, points=points,
                         drawing_id=drawing_db.id)
        self._session.add(line_db)
        await self._session.commit()

        return await self.get_drawing(room)

    async def create_message(self, body: str, room: Room, user: User) -> Message:
        message = Message(body, user, room)

        query = select(RoomDB).options(selectinload(RoomDB.users)).filter_by(uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        query = select(UserDB).filter_by(uuid=user.uuid)
        result = await self._session.scalars(query)
        user_db = result.first()

        message_db = MessageDB(body=body, user=user_db, room=room_db, uuid=message.uuid)
        self._session.add(message_db)
        await self._session.commit()

        return message

    async def list_messages(self, room: Room) -> List[Message]:
        query = select(RoomDB).filter_by(uuid=room.uuid)
        result = await self._session.scalars(query)
        room_db = result.first()

        query = select(MessageDB).options(selectinload(MessageDB.user)). \
            filter_by(room_id=room_db.id)
        result = await self._session.scalars(query)
        message_dbs = result.all()

        messages = []
        for message_db in message_dbs:
            user = self._convert_user(message_db.user, rooms=False)
            messages.append(Message(body=message_db.body, user=user, room=room))
        return messages
