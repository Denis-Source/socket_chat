import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "./api";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {addRoom, removeRoom, addBulkRoom, updateRoom} from "./Reducers/Room";
import Header from "./Components/Header/Header";
import styles from "./App.module.scss"
import RoomTabMinimal from "./Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import MessageTab from "./Components/Tabs/MessageTab/MessageTab";
import {MessageStatements} from "./StatementsTypes/MessageStatements";
import {addMessage, bulkAddMessage} from "./Reducers/Message";
import {RoomModel} from "./Molels/Room.model";
import RoomTab from "./Components/Tabs/RoomTab/RoomTab";

function App() {
    const dispatch = useDispatch()

    useWebSocket(WSS_FEED_URL, {
        onMessage: (event: WebSocketEventMap['message']) => {
            processMessages(JSON.parse(event.data));
        },
        share: true
    });

    const currentRoom: RoomModel = useSelector((state: any) => state.room.current);

    console.log(currentRoom);

    const processMessages = (data: any) => {
        const type = data.payload.message;
        const payload = data.payload;

        switch (type) {
            case UserStatements.UserCreated:
                dispatch(setUser(payload.user));
                break;
            case UserStatements.UserChanged:
                dispatch(setUser(payload.user));
                break;
            case RoomStatements.RoomsListed:
                dispatch(addBulkRoom(data.payload.list));
                break;
            case RoomStatements.RoomCreated:
                dispatch(addRoom(data.payload.room))
                break;
            case RoomStatements.RoomDeleted:
                dispatch(removeRoom(data.payload.room));
                break;
            case RoomStatements.RoomChanged:
                dispatch(updateRoom(data.payload.room));
                break;
            case MessageStatements.MessageListed:
                dispatch(bulkAddMessage(data.payload.list));
                break;
            case MessageStatements.MessageCreated:
                dispatch(addMessage(data.payload.object));
        }
    }

    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.layout}>
                {currentRoom ?
                    <>
                        <RoomTabMinimal/>
                        <MessageTab/>
                    </>
                    :
                    <>
                        <div></div>
                        <RoomTab/>
                    </>
                }

            </div>
        </div>
    );
}

export default App;
