import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "./Reducers/User";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "./api";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {addBulkRoom, addRoom, leaveRoom, removeRoom, updateRoom,} from "./Reducers/Room";
import Header from "./Components/Header/Header";
import styles from "./App.module.scss";
import RoomTabMinimal from "./Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import MessageTab from "./Components/Tabs/MessageTab/MessageTab";
import {MessageStatements} from "./StatementsTypes/MessageStatements";
import {addMessage, bulkAddMessage} from "./Reducers/Message";
import RoomTab from "./Components/Tabs/RoomTab/RoomTab";
import LogTab from "./Components/Tabs/LogTab/LogTab";
import {addLog} from "./Reducers/Log";
import {LogOrigin} from "./Models/Log.model";
import {
    AppStates,
    ErrorMessages,
    LeftTabs,
    RightTabs,
    setAppState,
    setErrorMessage,
    setTheme
} from "./Reducers/General";
import Spinner from "./Components/Spinner/Spinner";
import DrawingTab from "./Components/Tabs/DrawingTab/DrawingTab";
import {DrawingStatements} from "./StatementsTypes/DrawingStatements";
import {addDrawingLine, setDrawing} from "./Reducers/Drawing";
import {useCookies} from "react-cookie";
import {TypeStatements} from "./StatementsTypes/TypeStatements";
import ErrorTab from "./Components/Tabs/ErrorTab/ErrorTab";

function App() {
    // Use dispatch
    const dispatch = useDispatch();

    // Configure websocket, specify callbacks
    // To handle incoming data
    useWebSocket(WSS_FEED_URL, {
        onOpen: () => {
            dispatch(setAppState(AppStates.Nominal));
            dispatch(
                addLog({
                    origin: LogOrigin.Received,
                    description: "opened WS",
                    time: new Date().toLocaleTimeString(),
                    type: TypeStatements.Result,
                })
            );
        },
        onMessage: (event: WebSocketEventMap["message"]) => {
            processMessages(JSON.parse(event.data));
        },
        onClose: () => {
            dispatch(
                addLog({
                    origin: LogOrigin.Received,
                    description: "closed WS",
                    time: new Date().toLocaleTimeString(),
                    type: TypeStatements.Result,
                })
            );
            dispatch(setAppState(
                AppStates.Errored));
            dispatch(
                setErrorMessage(ErrorMessages.Disconnected));
        },
        onError: () => {
            dispatch(
                addLog({
                    origin: LogOrigin.Received,
                    description: "connection error",
                    time: new Date().toLocaleTimeString(),
                    type: TypeStatements.Result,
                }));
            dispatch(
                setAppState(AppStates.Errored))
            dispatch(
                setErrorMessage(ErrorMessages.Unknown))
        },
        share: true,
    });

    // Use cookies to properly render theme
    const [cookies] = useCookies(["theme"]);
    useEffect(() => {
        cookies.theme && dispatch(setTheme(parseInt(cookies.theme)));
    });

    // Get tab states to render elements based on them
    const {leftTab, rightTab} = useSelector((state: any) => state.general);
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

    // Get application state from the state
    const appState: AppStates = useSelector((state: any) => state.general.appState);

    // Set the tabs based on the selected in the state
    let leftTabElement;
    let rightTabElement;

    switch (leftTab) {
        case LeftTabs.Log:
            leftTabElement = <LogTab/>;
            break;
        case LeftTabs.Rooms:
            leftTabElement = <RoomTabMinimal/>;
    }

    switch (rightTab) {
        case RightTabs.Messages:
            rightTabElement = <MessageTab/>;
            break;
        case RightTabs.Rooms:
            rightTabElement = <RoomTab/>;
            break;
        case RightTabs.Drawing:
            rightTabElement = <DrawingTab/>;
            break;
    }

    // Set the application window depending on the application state
    let window;
    switch (appState) {
        case AppStates.Loading:
            window =
                <Spinner/>;
            break;
        case AppStates.Nominal:
            window = <div className={styles.container}>
                <Header/>
                <div className={styles.layout}>
                    <div className={styles.leftTab}>{leftTabElement}</div>
                    <div className={styles.rightTab}>{rightTabElement}</div>
                </div>
            </div>
            break;
        case AppStates.Errored:
            window = <div className={styles.container}>
                <Header/>
                <div className={styles.layout}>
                    <div className={styles.leftTab}>
                        <LogTab/>
                    </div>
                    <div className={styles.rightTab}>
                        <ErrorTab/>
                    </div>
                </div>
            </div>
    }

    console.log(appState);

    return (
        <div
            className={styles.body}
            style={{
                background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
            }}
        >
            {window}
        </div>
    );
}

export default App;
