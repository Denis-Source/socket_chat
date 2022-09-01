from storage.memory_storage import MemoryStorage


class Config:
    IP = "127.0.0.1"
    PORT = 9000

    STORAGE_CLS = MemoryStorage

    MESSAGE_HISTORY_LIMIT = 100
