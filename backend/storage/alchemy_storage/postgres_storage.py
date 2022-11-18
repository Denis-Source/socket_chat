from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from storage.alchemy_storage.alchemy_storage import AlchemyStorage


class PostgreStorage(AlchemyStorage):
    """
    Postgresql storage class

    Inherits from AlchemyStorage class
    Converts basic sqlite connection in postgreSQL one
    Requires credentials specified in _db_credentials class attribute
    """
    _db_credentials = {
        "user": "",
        "dbname": "",
        "password": "",
        "address": ""
    }

    NAME = "postgres_storage"
    _engine = create_async_engine(
        f"postgresql+asyncpg://"
        f"{_db_credentials.get('user')}:"
        f"{_db_credentials.get('password')}"
        f"@{_db_credentials.get('address')}"
        f"/{_db_credentials.get('dbname')}",
    )
    _session = AsyncSession(_engine, expire_on_commit=False)
