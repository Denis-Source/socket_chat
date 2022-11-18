import pickle

from select import select
from sqlalchemy import delete, update, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import selectinload

import models
from models.model_types import ModelTypes
from storage.base_storage import BaseStorage
from .tables import UserDB, Base, RoomDB, MessageDB, DrawingDB, LineDB
from ..exceptions import NotFoundException


class AlchemyStorage(BaseStorage):
    """
    SQLAlchemy storage class

    Stores models in a form of ORM models
    The ORM models is defined in tables module

    Uses SQLAlchemy async extension
    Relies on 2. api (select, update, delete) classes
    Converts ORM models to native ones
    """
    NAME = "alchem_storage"
    _engine = create_async_engine(
        "sqlite+aiosqlite:///storage.db",
    )
    _session = AsyncSession(_engine, expire_on_commit=False)

    @classmethod
    async def prepare(cls):
        """
        Opens the session, creates tables

        If the application closed abruptly and some users were in the room
        Resets those rooms

        :return:        None
        """
        cls.logger.info(f"{cls.NAME} init")
        async with cls._engine.begin() as conn:
            cls.logger.debug(f"creating tables if needed")
            await conn.run_sync(Base.metadata.create_all)

        cls.logger.debug(f"resetting {ModelTypes.USER}s in {ModelTypes.ROOM}s if needed")
        query = update(UserDB).where(UserDB.room_uuid is not None).values(room_uuid=None)
        await cls._session.execute(query)
        await cls._session.commit()

    async def _query_user(self, uuid: str) -> UserDB:
        self.logger.debug(f"querying {ModelTypes.USER}")
        query = select(UserDB).options(selectinload(UserDB.room)).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        return result.first()

    async def _query_room(self, uuid: str) -> RoomDB:
        self.logger.debug(f"querying {ModelTypes.ROOM}")
        query = select(RoomDB).options(selectinload(RoomDB.users), selectinload(RoomDB.drawing),
                                       selectinload(RoomDB.messages)).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        return result.first()

    async def _query_message(self, uuid: str) -> MessageDB:
        self.logger.debug(f"querying {ModelTypes.MESSAGE}")
        query = select(MessageDB).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        return result.first()

    async def _query_drawing(self, uuid: str) -> DrawingDB:
        self.logger.debug(f"querying {ModelTypes.DRAWING}")
        query = select(DrawingDB).options(selectinload(DrawingDB.lines)).filter_by(uuid=uuid)
        result = await self._session.scalars(query)
        return result.first()

    async def _get_user(self, uuid: str) -> "models.user.User":
        self.logger.debug(f"getting {ModelTypes.USER} from {self}")
        user_db = await self._query_user(uuid)

        if user_db:
            user = models.user.User.from_data(
                user_db.name,
                user_db.uuid,
                user_db.room_uuid,
            )
            self.logger.debug(f"got {user} from {self}")
            return user
        else:
            self.logger.debug(f"{ModelTypes.USER} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.USER)

    async def _get_room(self, uuid: str) -> "models.room.Room":
        self.logger.debug(f"getting {ModelTypes.ROOM} from {self}")
        room_db = await self._query_room(uuid)

        if room_db:
            query = select(UserDB).filter_by(room_uuid=uuid)
            result = await self._session.scalars(query)
            users_db = result.all()

            query = select(MessageDB).options(selectinload(MessageDB.user)).filter_by(room_uuid=uuid)
            result = await self._session.scalars(query)
            messages_db = result.all()

            query = select(DrawingDB).filter_by(room_uuid=uuid)
            result = await self._session.scalars(query)
            drawing_db = result.first()

            drawing = await self._get_drawing(drawing_db.uuid)

            room = models.room.Room.from_data(
                room_db.name,
                room_db.uuid,
                room_db.color,
                [models.user.User.from_data(
                    user_db.name,
                    user_db.uuid,
                    user_db.room_uuid,
                ) for user_db in users_db],
                [models.message.Message.from_data(
                    body=message_db.body,
                    user=models.user.User.from_data(
                        message_db.user.name,
                        message_db.user.uuid,
                        message_db.user.room_uuid,
                    ),
                    room_uuid=message_db.room_uuid,
                    created=message_db.created
                ) for message_db in messages_db],
                drawing
            )

            self.logger.debug(f"got {ModelTypes.ROOM} {room} from {self}")
            return room
        else:
            self.logger.debug(f"{ModelTypes.ROOM} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.ROOM)

    async def _get_message(self, uuid: str) -> "models.message.Message":
        self.logger.debug(f"getting {ModelTypes.MESSAGE} from {self}")
        message_db = await self._query_message(uuid)
        if message_db:
            message = models.message.Message.from_data(
                body=message_db.body,
                user=models.user.User.from_data(
                    message_db.user.name,
                    message_db.user.uuid,
                    message_db.user.room_uuid,
                ),
                room_uuid=message_db.room_uuid,
                created=message_db.created,
            )
            self.logger.debug(f"got {ModelTypes.MESSAGE} {message} from {self}")
            return message
        else:
            self.logger.debug(f"{ModelTypes.ROOM} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.MESSAGE)

    async def _get_drawing(self, uuid: str) -> "models.drawing.Drawing":
        self.logger.debug(f"getting {ModelTypes.DRAWING} from {self}")
        drawing_db = await self._query_drawing(uuid)
        if drawing_db:
            self.logger.debug(f"getting ({uuid}) {ModelTypes.DRAWING}s lines")
            query = select(LineDB).filter_by(drawing_uuid=uuid)
            result = await self._session.scalars(query)
            lines_db = result.all()

            drawing = models.drawing.Drawing.from_data(
                name=drawing_db.name,
                uuid=drawing_db.uuid,
                room_uuid=drawing_db.room_uuid,
                lines=[models.line.Line.from_data(
                    uuid=line_db.uuid,
                    color=line_db.color,
                    tool=line_db.tool,
                    points=self._decompress_points(line_db.points),
                    drawing_uuid=line_db.uuid
                ) for line_db in lines_db]
            )
            self.logger.debug(f"got {ModelTypes.DRAWING} {drawing} from {self}")
            return drawing
        else:
            self.logger.debug(f"{ModelTypes.ROOM} ({uuid}) is not in {self}")
            raise NotFoundException(uuid, ModelTypes.DRAWING)

    async def _list_rooms(self):
        query = select(RoomDB).options(selectinload(RoomDB.users), selectinload(RoomDB.drawing),
                                       selectinload(RoomDB.messages))
        result = await self._session.scalars(query)
        rooms_db = result.all()

        return [models.room.Room.from_data(
            room_db.name,
            room_db.uuid,
            room_db.color,
            [models.user.User.from_data(
                user_db.name,
                user_db.uuid,
                user_db.room_uuid,
            ) for user_db in room_db.users],
            [models.message.Message.from_data(
                body=message_db.body,
                user=None,
                room_uuid=message_db.room_uuid,
                created=message_db.created
            ) for message_db in room_db.messages],
            None
        ) for room_db in rooms_db]

    async def _put_user(self, user: "models.user.User"):
        user_db = await self._query_user(user.uuid)

        if user_db:
            self.logger.debug(f"{ModelTypes.USER} {user} is already stored, changing")
            user_db.name = user.name
            user_db.room_uuid = user.room_uuid
        else:
            self.logger.debug(f"{user} is not already stored, adding")
            self._session.add(UserDB(
                name=user.name,
                uuid=user.uuid,
                room_uuid=user.room_uuid
            ))
        await self._session.commit()
        self.logger.debug(f"{ModelTypes.USER} {user} put in {self}")

    async def _put_room(self, room: "models.room.Room"):
        room_db = await self._query_room(room.uuid)
        if room_db:
            self.logger.debug(f"{ModelTypes.ROOM} {room} is already stored, changing")
            room_db.name = room.name
            room_db.color = room.color
        else:
            self.logger.debug(f"{ModelTypes.ROOM} {room} is not already stored, adding")
            self._session.add(RoomDB(
                name=room.name,
                uuid=room.uuid,
                color=room.color
            ))

        await self._session.commit()
        self.logger.debug(f"{ModelTypes.ROOM} {room} put in {self}")

    async def _put_message(self, message: "models.message.Message"):
        message_db = await self._query_message(message.uuid)
        if message_db:
            raise NotImplementedError
        else:
            self.logger.debug(f"{ModelTypes.MESSAGE} {message} is not already stored, adding")
            self._session.add(MessageDB(
                body=message.body,
                uuid=message.uuid,
                user_uuid=message.user.uuid,
                room_uuid=message.room_uuid,
                created=message.created
            ))
        await self._session.commit()
        self.logger.debug(f"{ModelTypes.MESSAGE} {message} put in {self}")

    async def _put_drawing(self, drawing: "models.drawing.Drawing"):
        self.logger.debug(f"putting {ModelTypes.DRAWING} {drawing}")
        drawing_db = await self._query_drawing(drawing.uuid)
        if not drawing_db:
            self.logger.debug(f"{ModelTypes.DRAWING} {drawing} is not already stored, adding")
            self._session.add(DrawingDB(
                uuid=drawing.uuid,
                name=drawing.name,
                room_uuid=drawing.room_uuid
            ))
        else:
            self.logger.debug(f"{ModelTypes.DRAWING} {drawing} is already stored, changing")
            if not drawing.lines:
                query = delete(LineDB).where(LineDB.drawing_uuid == drawing.uuid)
                await self._session.execute(query)

        await self._session.commit()
        self.logger.debug(f"{ModelTypes.DRAWING} {drawing} put in {self}")

    @staticmethod
    def _compress_points(points):
        return pickle.dumps(points, 0).decode()

    @staticmethod
    def _decompress_points(c_points):
        return pickle.loads(c_points.encode())

    async def _put_line(self, line: "models.line.Line"):
        self.logger.debug(f"putting {ModelTypes.LINE} {line}")
        self._session.add(LineDB(
            color=line.color,
            tool=line.tool,
            name=line.name,
            uuid=line.uuid,
            points=self._compress_points(line.points),
            drawing_uuid=line.drawing_uuid
        ))

    async def _delete_user(self, user: "models.user.User"):
        self.logger.debug(f"deleting {ModelTypes.USER} {user} in {self}")
        query = delete(UserDB).filter_by(uuid=user.uuid)
        await self._session.execute(query)
        await self._session.commit()
        self.logger.debug(f"{user} deleted in {self}")

    async def _delete_room(self, room: "models.room.Room"):
        drawing_db = await self._get_drawing(room.drawing.uuid)

        self.logger.debug(f"deleting {ModelTypes.ROOM} {room} in {self}")
        query = delete(RoomDB).filter_by(uuid=room.uuid)
        await self._session.execute(query)

        self.logger.debug(f"deleting {ModelTypes.DRAWING} in {ModelTypes.ROOM} {room}")
        query = delete(DrawingDB).where(DrawingDB.room_uuid == room.uuid)
        await self._session.execute(query)

        self.logger.debug(f"deleting {ModelTypes.MESSAGE}s in {ModelTypes.ROOM} {room}")
        query = delete(MessageDB).where(MessageDB.room_uuid == room.uuid)
        await self._session.execute(query)

        self.logger.debug(f"resetting {ModelTypes.ROOM} {room} {ModelTypes.ROOM}'s {ModelTypes.USER}s")
        query = update(UserDB).filter_by(room_uuid=room.uuid).values(room_uuid=None)
        await self._session.execute(query)

        self.logger.debug(f"deleting {ModelTypes.LINE}s in {ModelTypes.ROOM} {room}")
        query = delete(LineDB).where(LineDB.drawing_uuid == drawing_db.uuid)
        await self._session.execute(query)

        await self._session.commit()
        self.logger.debug(f"{ModelTypes.ROOM} {room} deleted in {self}")

    @classmethod
    async def close(cls):
        """
        Closes the session as the library freaks out if not done otherwise

        :return:        None
        """
        await cls._session.close()
        cls.logger.info(f"closing {cls.NAME}")
