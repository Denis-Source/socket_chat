import React from 'react';
import {useDispatch} from "react-redux";
import {setUser} from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "./api";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {add, remove, setBulk, update} from "./Reducers/Room";
import Header from "./Components/Header/Header";
import styles from "./App.module.scss"
import RoomTabMinimal from "./Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import MessageTab from "./Components/Tabs/MessageTab/MessageTab";

function App() {
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
                dispatch(setUser(payload.user));
                break;
            case UserStatements.UserChanged:
                console.log(payload.user);
                dispatch(setUser(payload.user));
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
        <div className={styles.container}>
            <Header/>
            <div className={styles.layout}>
                <RoomTabMinimal/>
                <MessageTab/>
            </div>
        </div>
    );
}

export default App;
