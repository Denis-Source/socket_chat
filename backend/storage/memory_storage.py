from models.room import Room
from .base_storage import BaseStorage, NoRoomSpecifiedException


class MemoryStorage(BaseStorage):
    rooms = {}

    def store_room(self, room: Room):
        self.rooms[room.get_uuid()] = room

    def get_room(self, uuid: str):
        room = self.rooms.get(uuid)
        if room:
            return room
        else:
            raise NoRoomSpecifiedException(f"No room with uuid {uuid}")

    def list_rooms(self):
        return [room for _, room in self.rooms]

    def delete_room(self, uuid):
        room = self.rooms.get(uuid)
        if room:
            self.rooms.pop(uuid)
        else:
            raise NoRoomSpecifiedException(f"No room with uuid {uuid}")

