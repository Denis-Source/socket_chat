import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {set} from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "./api";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {add, remove, setBulk, update} from "./Reducers/Room";
import {UserModel} from "./Molels/User.model";
import List from "./Components/Room/List/List";


function App() {
    const user: UserModel = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch()

    useWebSocket(WSS_FEED_URL, {
        onMessage: (event: WebSocketEventMap['message']) => {
            processMessages(JSON.parse(event.data));
            },
        share: true
    });

    const processMessages = (data: any) => {
        const type = data.payload.message;
        const payload = data.payload;

        switch (type) {
            case UserStatements.UserCreated:
                dispatch(set(payload.user));
                break;
            case RoomStatements.RoomsListed:
                dispatch(setBulk(data.payload.list));
                break;
            case RoomStatements.RoomCreated:
                dispatch(add(data.payload.room))
                break;
            case RoomStatements.RoomDeleted:
                dispatch(remove(data.payload.room));
                break;
            case RoomStatements.RoomChanged:
                dispatch(update(data.payload.room));
                break;
        }
    }
    return (
        <div>
            <h1>{user?.name}</h1>
            <div>
                <List/>
            </div>
        </div>
    );
}

export default App;
