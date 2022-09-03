import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "./api";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {addBulkRoom, addRoom, removeRoom, updateRoom} from "./Reducers/Room";
import Header from "./Components/Header/Header";
import styles from "./App.module.scss"
import RoomTabMinimal from "./Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import MessageTab from "./Components/Tabs/MessageTab/MessageTab";
import {MessageStatements} from "./StatementsTypes/MessageStatements";
import {addMessage, bulkAddMessage} from "./Reducers/Message";
import RoomTab from "./Components/Tabs/RoomTab/RoomTab";
import LogTab from "./Components/Tabs/LogTab/LogTab";
import {addLog} from "./Reducers/Log";
import {LogOrigin} from "./Models/Log.model";
import {LeftTabs, RightTabs} from "./Reducers/General";

function App() {
    const dispatch = useDispatch()

    useWebSocket(WSS_FEED_URL, {
        onMessage: (event: WebSocketEventMap['message']) => {
            processMessages(JSON.parse(event.data));
        },
        share: true
    });

    const leftTab: LeftTabs = useSelector((state: any) => state.general.leftTab)
    const rightTab: RightTabs = useSelector((state: any) => state.general.rightTab)

    const processMessages = (data: any) => {
        const type = data.payload.message;
        const payload = data.payload;
        dispatch(addLog({
            origin: LogOrigin.Received,
            description: payload.message,
            time: new Date().toLocaleTimeString(),
            type: data.type,
        }));
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

    let leftTabElement;
    let rightTabElement;

    switch (leftTab) {
        case LeftTabs.Log:
            leftTabElement = <LogTab/>
            break;
        case LeftTabs.Rooms :
            leftTabElement = <RoomTabMinimal/>
    }

    switch (rightTab) {
        case RightTabs.Messages:
            rightTabElement = <MessageTab/>
            break;

        case RightTabs.Rooms:
            rightTabElement = <RoomTab/>
            break;
    }

    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.layout}>
                {leftTabElement}
                {rightTabElement}
            </div>
        </div>
    );
}

export default App;
