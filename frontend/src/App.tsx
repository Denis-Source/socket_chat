import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import { WSS_FEED_URL } from "./api";
import { UserStatements } from "./StatementsTypes/UserStatements";
import { RoomStatements } from "./StatementsTypes/RoomStatements";
import {
    addBulkRoom,
    addRoom,
    leaveRoom,
    removeRoom,
    updateRoom,
} from "./Reducers/Room";
import Header from "./Components/Header/Header";
import styles from "./App.module.scss";
import RoomTabMinimal from "./Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import MessageTab from "./Components/Tabs/MessageTab/MessageTab";
import { MessageStatements } from "./StatementsTypes/MessageStatements";
import { addMessage, bulkAddMessage } from "./Reducers/Message";
import RoomTab from "./Components/Tabs/RoomTab/RoomTab";
import LogTab from "./Components/Tabs/LogTab/LogTab";
import { addLog } from "./Reducers/Log";
import { LogOrigin } from "./Models/Log.model";
import { LeftTabs, RightTabs, setLoaded, setTheme } from "./Reducers/General";
import Spinner from "./Components/Spinner/Spinner";
import { UserModel } from "./Models/User.model";
import DrawingTab from "./Components/Tabs/DrawingTab/DrawingTab";
import { DrawingStatements } from "./StatementsTypes/DrawingStatements";
import { addDrawingLine, setDrawing } from "./Reducers/Drawing";
import { useCookies } from "react-cookie";

function App() {
    // Use dispatch
    const dispatch = useDispatch();

    // Configure websocket, specify callbacks
    // To handle incoming data
    useWebSocket(WSS_FEED_URL, {
        onMessage: (event: WebSocketEventMap["message"]) => {
            processMessages(JSON.parse(event.data));
        },
        share: true,
    });

    // Use cookies to properly render theme

    const [cookies] = useCookies(["theme"]);
    useEffect(() => {
        cookies.theme && dispatch(setTheme(parseInt(cookies.theme)));
    });

    // Get tab states to render elements based on them
    const { leftTab, rightTab } = useSelector((state: any) => state.general);
    const loading: boolean = useSelector((state: any) => state.general.loading);
    const theme: string[] = useSelector((state: any) => state.general.theme);
    const processMessages = (data: any) => {
        /*
                        Processes the incoming data
                        Adds log item to the state
                */

        // Get type of the message and payload
        const type = data.payload.message;
        const payload = data.payload;

        // Add log item to the state
        dispatch(
            addLog({
                origin: LogOrigin.Received,
                description: payload.message,
                time: new Date().toLocaleTimeString(),
                type: data.type,
            })
        );

        // Based on the incoming statement message
        // Set the internal state
        switch (type) {
            case UserStatements.UserCreated:
                dispatch(setUser(payload.object));
                break;
            case UserStatements.UserChanged:
                dispatch(setUser(payload.object));
                break;
            case RoomStatements.RoomsListed:
                dispatch(addBulkRoom(data.payload.list));
                break;
            case RoomStatements.RoomCreated:
                dispatch(addRoom(data.payload.object));
                break;
            case RoomStatements.RoomDeleted:
                dispatch(removeRoom(data.payload.object));
                break;
            case RoomStatements.RoomLeft:
                dispatch(leaveRoom());
                break;
            case RoomStatements.RoomChanged:
                dispatch(updateRoom(data.payload.object));
                break;
            case MessageStatements.MessageListed:
                dispatch(bulkAddMessage(data.payload.list));
                break;
            case MessageStatements.MessageCreated:
                dispatch(addMessage(data.payload.object));
                break;
            case DrawingStatements.DrawingGot:
                dispatch(setDrawing(data.payload.object));
                break;
            case DrawingStatements.DrawLineChanged:
                dispatch(addDrawingLine(data.payload.object));
                break;
        }
    };

    // Get user model from the store
    const user: UserModel = useSelector((state: any) => state.user.user);

    // Set the tabs based on the selected in the state
    let leftTabElement;
    let rightTabElement;

    switch (leftTab) {
        case LeftTabs.Log:
            leftTabElement = <LogTab />;
            break;
        case LeftTabs.Rooms:
            leftTabElement = <RoomTabMinimal />;
    }

    switch (rightTab) {
        case RightTabs.Messages:
            rightTabElement = <MessageTab />;
            break;
        case RightTabs.Rooms:
            rightTabElement = <RoomTab />;
            break;
        case RightTabs.Drawing:
            rightTabElement = <DrawingTab />;
            break;
    }

    // Set loading to false if user is loaded
    useEffect(() => {
        user && dispatch(setLoaded());
    });

    return (
        <div
            className={styles.body}
            style={{
                background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
            }}
        >
            {!loading ? (
                <div className={styles.container}>
                    <Header />
                    <div className={styles.layout}>
                        <div className={styles.leftTab}>{leftTabElement}</div>
                        <div className={styles.rightTab}>{rightTabElement}</div>
                    </div>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    );
}

export default App;
