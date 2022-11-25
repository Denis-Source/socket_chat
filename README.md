# Websocket Chat

Websocket realtime chat application.
https://chat.zoloto.cx.ua/
https://chat.zoloto.cx.ua/info

## Installation
```sh
git clone https://github.com/Denis-Source/socket_chat.git
```

#### backend

After cloning the repository, go to the `backend` folder, configure the virtual environment  and install dependencies.

```sh
cd .\socket_chat\backend\

python -m venv env
.\env\Scripts\Activate.ps1
pip install -r .\requirements.txt
```

You can specify the port and IP address in the configs.

```python
IP = "127.0.0.1"
PORT = 9000
```

There is an option to specify the storage solution. In the example below, the mock memory storage is used.

```python
from storage.memory_storage import MemoryStorage

STORAGE_CLS = MemoryStorage
```

After the initial configuration, you will be able to run the backend part of the application.

```python
python .\main.py
```

```sh
2022-09-12 18:08:33,964 DEBUG   asyncio                 Using proactor: IocpProactor
2022-09-12 18:08:33,965 INFO    server                  starting server
2022-09-12 18:08:33,966 INFO    websockets.server       server listening on 127.0.0.1:9000
```

#### Frontend
The frontend configuration is more straight forward.
```
cd ..\frontend\
npm i

npm start
```
***

## Showcase
In a nutshell, it is a simple one-page application with a minimalistic design and a Two-tab layout:
![01 homepage](https://user-images.githubusercontent.com/58669569/189720077-34f986a1-b610-4b4f-9deb-bca8995c7f4e.png)

The mobile version is also available but it lacks the functionality if compared to the desktop one:
![mobile](https://user-images.githubusercontent.com/58669569/189720117-6cac8786-c9ae-40b7-b446-d559e115ad0a.png)

All of the changes, incoming messages and other things can be viewed in a realtime, as the application is based on websocket communication protocol.
***

### Logs
Both frontend and backend provide verbose logging. The frontend one is visible by a user in the left tab and displays all of the communications between him and the server:
![04 logs](https://user-images.githubusercontent.com/58669569/189720143-4c16bd19-97c7-4a39-84f9-0fed24232bd4.png)
***

### Usernames
The application does not require registration of any sort as the user name is generated at the start:
![02 user](https://user-images.githubusercontent.com/58669569/189720158-4abaa8b3-8b81-433b-bd6a-f3a435a6c51a.png)

The application is completely anonymous and does not store any user data as it is not needed. Also, there is no form of roles or admin privileges, anyone can do anything.

Most of the names are changeable, the username as well.

All entities of the application are distinguished by their universally unique identifier (UUID), so all of the names initially have that `00000000-0000-0000-0000-000000000000` look.
***

### Rooms
The main objective of the application is to provide an ability to exchange messages between people, which takes place in rooms. The room can be created or deleted by anyone and it is fully customizable:
![03 room](https://user-images.githubusercontent.com/58669569/189720181-7dbd8b26-0d67-4922-afe2-411c80863cb5.png)

The room list is sorted by the room creation time, to solve the problem of navigating a potential overwhelmingly large number of them, the search is provided.
***

### Messages
After the room is selected, the user is provided with an unlimited message history and an ability to create their own messages:
![05 messages](https://user-images.githubusercontent.com/58669569/189720206-b0e0d9a0-3673-43a0-9358-d6e95db85e3d.png)
The amount of rooms and messages are **NOT LIMITED**.
***

### Side tabs
When entered the room, there is still an option to see rooms, by switching the left tab to the room list:
![07 roomMini](https://user-images.githubusercontent.com/58669569/189720568-b46db0c2-d072-425c-a16c-71fe9f4c1098.png)
Both left and right tabs can be selected. The one consists of logging and room list, the right one – a list of messages, a list of users entered the room and a drawing. 
***

### Drawings
As a bonus, every room has a tab with a simple drawing board:
![08 drawing](https://user-images.githubusercontent.com/58669569/189720244-4429fd68-4a93-4d76-a9b0-2c5acbdf4e3e.png)
***

There is a simple selection of tools and colors that can be used. The drawing is shared between all of the room attendants.
![09 amogus](https://user-images.githubusercontent.com/58669569/189720268-8bf7de86-0b10-40f2-8583-3c5430976174.png)
***

### Themes
Having a simple design allows the application to easily change its looks with a theme slider:
![10 themes](https://user-images.githubusercontent.com/58669569/189720282-cd7f4b3a-0bf7-4d25-b8bf-011674ea2de0.png)

There are 8 different themes available with the following color schemes:
![themes](https://user-images.githubusercontent.com/58669569/189720318-2fcc11ad-b98b-4eb2-9491-85b51443bdd5.png)
***

## Backend
The backend of the applications is written using [WebSockets](https://websockets.readthedocs.io/en/stable/) library. As it is a relatively simple demo, the application was written from scratch. The data travels through the internal structure:
![Func Scheme (1)](https://user-images.githubusercontent.com/58669569/189756284-ebe04879-31bd-4508-9f8c-39aa4ad16523.png)

It is parsed with the `Utils` class, then goes to the `Server` class which decides what to do with it. All of the actions are done with the `Model` classes which are internally mapped with a database via the `Storage` class. 

#### Statements
All of the communications of the applications are done in the following format:
```json
{
    "type": "result",
    "payload": {
        "message": "user_created",
        "object": {
            "uuid": "02687b26-8620-4936-9675-00c2a06f43c8",
            "name": "user-02687b26-8620-4936-9675-00c2a06f43c8",
            "room_uuid": null
        }
    }
}
```

> This statement comes first from the server and tells the client it's identity.

The statement has one of the following types:
- `result` that comes from the server and tells a client what to do;
- `call` that comes from the client and tells the server what to do;
- `error`.

All of the statement have `payload` field. 
`message` specifies the type of actions that were or should be performed. Both the backend and frontend side have enumerations that list all of the available `message` types.
To send a data, `payload` could have other fields, such as `object`, `list`.

The statement used to change a room color:
```json
{
    "type": "call",
    "payload": {
        "message": "change_color",
        "uuid": "45843334-b2ea-4673-86d1-6c8aab920b74",
        "color": "#ff0000"
    }
}
```
***

### Utils class
All of the incoming messages are filtered and cleaned with the `Utils` class `parse_statement` method with the specified validators. 

The `prepare_statement` method is on the other hand is used to construct a statement based on type, message and other additional parameters.
***

### Server class
The main logic is done in `Server` class that based on the incoming messages. To avoid messiness, all of the callable methods are grouped in the dictionary:
```python
self.call_methods = {
	RoomCallStatements.CREATE_ROOM: self.create_room,
	RoomCallStatements.DELETE_ROOM: self.delete_room,
	RoomCallStatements.LIST_ROOMS: self.list_rooms,
	RoomCallStatements.ENTER_ROOM: self.enter_room,
	RoomCallStatements.LEAVE_ROOM: self.leave_room,
	RoomCallStatements.CHANGE_ROOM_COLOR: self.change_room_color,
	RoomCallStatements.CHANGE_ROOM_NAME: self.change_room_name,

	UserCallStatements.CHANGE_USER_NAME: self.change_user_name,

	MessageCallStatements.CREATE_MESSAGE: self.create_message,
	MessageCallStatements.LIST_MESSAGES: self.list_messages,

	DrawingCallStatements.CHANGE_DRAW_LINE: self.change_draw_line,
	DrawingCallStatements.GET_DRAWING: self.get_drawing,
	DrawingCallStatements.RESET_DRAWING: self.reset_drawing
}
```
To handle the connection with a user, there is also `self.connections` dictionary, that maps user uuid with the corresponding websocket connection.

The websocket is based on a generator, so the for loop is used, to handle `user` statements:
```python
async for raw_message in self.connections.get(user.uuid):
	method_type, payload = Utils.parse_statement(raw_message)
	method = self.call_methods[method_type]

	await method(user, payload)
```
In a case of calling the non existing method or not providing needed data, server sends the corresponding error statement.
***
### Model classes
To divide the server logic and direct data manipulation, the `Model` classes are implemented.

As we can see from the `AbstractModel` all of the classes should implement the following class methods:
- `create` to create a model instance
- `list` to list all of the model instances
- `get` to get a specific model instance (based on `uuid`)			
- `delete` to delete a model instance

And instance `get_dict` to construct a dictionary representation of an instance that is easily JSON serializable.

The models uses `Storage` class to save it's contents to the database. Since the `websockets` library is *asynchronous*, the `Storage` is made as well. That means that the model can not use default `__init__()` constructor to create an instance, so the `create()` class method is needed.

As said earlier, all of the `Model` logic is mapped with the `Storage` class, that is specified in the configs.

For example model class method `get` simply gets the model from the storage:
```python
@classmethod
async def get(cls, uuid: str):
	cls.logger.debug(f"getting {cls.TYPE} ({uuid})")
	return await cls.storage.get(cls.TYPE, uuid)
```

All of those methods are defined in the `BaseModel` class and overriden if needed in the other children classes.

The `BaseModel` also provides the `uuid` generation which defines instance uniquness:
```
class BaseModel(AbstractModel):
    def __init__(self):
        self.uuid = str(uuid4())
        self.name = f"{self.TYPE}-{self.uuid}"
```

All of the models should have a `TYPE` that is defined in the `ModelTypes` enumeration. This is crusial as it is used by the `Storage` class.
```python
class ModelTypes(str, Enum):
    BASE = "base"
    USER = "user"
    ROOM = "room"
    MESSAGE = "message"
    DRAWING = "drawing"
    LINE = "line"
    COLOR = "color"
```
***

### Storage class
To separate mandate file or SQL operaions from the `Model` class, the `Storage` class was implemented. It's created using *repository* pattern, as it provides only **4** methods:
- `get()`;
- `list()`;
- `put()`;
- `delete()`.

There are also 2 onetime-run static methods that are needed in some cases:
- `prepare()`;
- `close()`.

All of those method are defined in the `BaseStorage` class.
The `BaseStorage` class implements those methods by using dictionary with the not yet implemented model type specific methods:

```python
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
```
So the child class should only implement those methods or the `NotImplementedError` will be used.

#### MemoryStorage
For testing and developing purpouses the memory storage was created. It uses 5 different dictionaries to store models in memory:

```python
class MemoryStorage(BaseStorage):
    _users = {}
    _rooms = {}
    _messages = {}
    _drawings = {}
    _lines = {}
```

All of the methods are implemented by dictionary access or `pop()` method.
***
#### AlchemyStorage
To store data properly the `AlchemyStorage` class was implemented that is based on the [SQLAlchemy](https://www.sqlalchemy.org/). The [ORM](https://ru.wikipedia.org/wiki/ORM) models were used they are not the same models that were described previously. The ORM models provided by the library are then reconstructed in the appropriate `Model` classes. 

> That decision unsures that the project does not depend on the SQLAlchemy storage solution.

To store data in the specified way, the model tables were created using [declarative mapping](https://docs.sqlalchemy.org/en/13/orm/mapping_styles.html) (the imperative mappings did not work for me with the [asynchronous extension](https://docs.sqlalchemy.org/en/14/orm/extensions/asyncio.html)).

User model table for example:
```python
Base = declarative_base()

class UserDB(Base):
	__tablename__ = "user"
	__mapper_args__ = {'eager_defaults': True}

	name = Column(String(64))
	uuid = Column(String(36), primary_key=True)
	room_uuid = Column(String, ForeignKey("room.uuid"))
	room = relationship("RoomDB", back_populates="users")
	messages = relationship("MessageDB", back_populates="user")
```

> The primary key is `uuid` as it satisfies the uniqueness constraint. There are also relations with the other tables as should be.

All of the database manipulations are done with [ORM Queries in 2.0 style](https://docs.sqlalchemy.org/en/14/glossary.html#term-2.0-stylehttps://docs.sqlalchemy.org/en/14/glossary.html#term-2.0-style) using `select`, `update` and 
`delete` query factories that are used with the session. Results are converted to classes with `scallars()` method.

Method to query a room for example:
```python
async def _query_room(self, uuid: str) -> RoomDB:
	query = select(RoomDB).options(selectinload(RoomDB.users), selectinload(RoomDB.drawing),
								   selectinload(RoomDB.messages)).filter_by(uuid=uuid)
	result = await self._session.scalars(query)
	return result.first()
```

> Considering the nature of asynchronous sqlachemy extension, we should specify loading of the related fields by calling `options` with the `selectinload`.

After the data is recieved from the DB, the `Model` `from_data()` methods come in handy.
Exapmle of the `_get_user()` method:
```python
async def _get_user(self, uuid: str) -> "models.user.User":
	user_db = await self._query_user(uuid)

	if user_db:
		user = models.user.User.from_data(
			user_db.name,
			user_db.uuid,
			user_db.room_uuid,
		)
		return user
	else:
		raise NotFoundException(uuid, ModelTypes.USER)
```

#### PostgreSQL
Given the ORM nature of SQLAlchemy, it is not that difficult to expand the previously mentioned `AlchemyStorage` class to the one that has an ability to connect to various "real" databases. In fact the only difference is the declaration of the database `engine`:
```py
class PostgreStorage(AlchemyStorage):
    _db_credentials = {
        "user": "user_name",
        "dbname": "chat_db",
        "password": "passwd",
        "address": "localhost"
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
```

Given the postgresql is installed, a database is created and the `config.py` has `STORAGE_CLS = PostgreStorage`, the backend will attempt to connect to the local postgreSQL server with the provided credentials.
***

## Frontend
Forntend is based on the [React](https://reactjs.org/)  framework. The looks and feels were designed from scratch.

### Project structure
The project was written using [TypeScript](https://www.typescriptlang.org/) and follows the basic react project structure. All of the components are styled with [sass](https://sass-lang.com/).

All of the source files are located in `src` folder. The application is split into components:
- `Buttons` that consists of the button template and all of the functional buttons, including navigation ones;
- `ColorPicker` different custom color pickers for rooms and drawing
- `Drawing`	drawing component based on [react-konva](https://konvajs.org/docs/react/index.html) `Stage`;
- `Header` that displays the heading of the application and username;
- `Input` components related to input fields;
- `Log`	components related to logging;
- `Message`	components related to messages;
- `Room` components related to rooms;
- `Spinner`;
- `Tabs` components that group other components into a layout.

#### Models and Enumerations
Considering that the project is written with TypeScript, there is `Model` folder that provides interfaces for the `Drawing`, `Log`, `Message`, `Room` and `User` interfaces.

Simple example of a `user` interface:
```ts
export interface UserModel {
    name: string;
    room_uuid?: string;
    uuid: string;
}
```
There are also Enumerations related to the statement types used to communicate with the server located in the `StatementTypes` folder.
***
#### Reducers
Taking into account that the project has a complex internal state (message history, drawing, log lists, etc.), the [redux](https://react-redux.js.org/) state manager was used. For every model, the corresponding [redux slice](https://redux-toolkit.js.org/api/createSlice) was implemented.

The application calls the reducers with `dispatch` to avoid infinite callback passing.
***

### Libraries used
#### [redux](https://redux.js.org/)
As mentioned previously.

#### [react-use-websocket](https://www.npmjs.com/package/react-use-websocket)
The application relies on the websocket communication protocol. All of the communications were implemented using the library with the statement constructor `prepareStatement()` in the `api.ts` file.

#### [react-scroll-to-bottom](https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react)
To implement automatic scrolling animations on new messages, log items room etc.

#### [react-viewport-list](https://www.npmjs.com/package/react-viewport-list)
The application has several lists that are potentially infinite in size. To avoid any lags related to it, this library was used to render only the viewed elements.

#### [react-konva](https://konvajs.org/docs/react/index.html)
To have a drawing board

#### [react-slider](https://www.npmjs.com/package/react-slider)
To have a theme switcher in the form of a slider.

#### [react-cookie](https://www.npmjs.com/package/react-cookie)
To save a preferred theme in cookies, selected with a previously mentioned slider.

> Only the theme number is stored in the cookies, there is no other data especially related to the user profile.

#### [use-sound](https://www.npmjs.com/package/use-sound)
The application has sound notifications, so the appropriate library was used.
> TypeScript does not recognize the `mp3` format with the `ES6` format, so the *good old* `require` was used for that. 

#### [react-router](https://reactrouter.com/en/main)
Even though it is a one page application, it still uses sever routes such as homepage, room page, information page, etc.
> Rooms have dynamic routing so it is possible to enter a room given its URL.

***
