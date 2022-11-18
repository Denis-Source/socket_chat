from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class UserDB(Base):
    __tablename__ = "user"

    name = Column(String(64))
    uuid = Column(String(36), primary_key=True)

    room_uuid = Column(String, ForeignKey("room.uuid"))
    room = relationship("RoomDB", back_populates="users")

    messages = relationship("MessageDB", back_populates="user")

    __mapper_args__ = {'eager_defaults': True}


class RoomDB(Base):
    __tablename__ = "room"

    name = Column(String(64))
    uuid = Column(String(36), primary_key=True)
    color = Column(String(9))
    users = relationship("UserDB", back_populates="room")
    messages = relationship("MessageDB", back_populates="room")
    drawing = relationship("DrawingDB", back_populates="room", uselist=False)

    __mapper_args__ = {'eager_defaults': True}


class MessageDB(Base):
    __tablename__ = "message"

    body = Column(Text)
    uuid = Column(String(36), primary_key=True)

    created = Column(String(40))

    user = relationship("UserDB", back_populates="messages")
    user_uuid = Column(String, ForeignKey("user.uuid"))

    room = relationship("RoomDB", back_populates="messages")
    room_uuid = Column(String, ForeignKey("room.uuid"))

    __mapper_args__ = {'eager_defaults': True}


class DrawingDB(Base):
    __tablename__ = "drawing"

    name = Column(String(64))
    uuid = Column(String(36), primary_key=True)

    room = relationship("RoomDB")
    room_uuid = Column(String, ForeignKey("room.uuid"))

    lines = relationship("LineDB", back_populates="drawing")

    __mapper_args__ = {'eager_defaults': True}


class LineDB(Base):
    __tablename__ = "line"

    color = Column(String(9))
    tool = Column(String(9))
    name = Column(String(64))
    uuid = Column(String(36), primary_key=True)
    points = Column(Text)

    drawing = relationship("DrawingDB", back_populates="lines")
    drawing_uuid = Column(String, ForeignKey("drawing.uuid"))

    __mapper_args__ = {'eager_defaults': True}
