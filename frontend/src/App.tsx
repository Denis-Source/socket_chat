import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import useWebSocket from "react-use-websocket";
import {processMessage, WSS_FEED_URL} from "./api";
import {addLog} from "./Reducers/Log";
import {LogOrigin} from "./Models/Log.model";
import {AppStates, ErrorMessages, setAppState, setErrorMessage, setTheme,} from "./Reducers/General";
import {useCookies} from "react-cookie";
import {TypeStatements} from "./StatementsTypes/TypeStatements";
import {RouterProvider} from 'react-router-dom';
import {router} from "./router";

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
            processMessage(JSON.parse(event.data));
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
            dispatch(setAppState(AppStates.Errored));
            dispatch(setErrorMessage(ErrorMessages.Disconnected));
        },
        onError: () => {
            dispatch(
                addLog({
                    origin: LogOrigin.Received,
                    description: "WS Error",
                    time: new Date().toLocaleTimeString(),
                    type: TypeStatements.Result,
                })
            );
            dispatch(setAppState(AppStates.Errored));
            dispatch(setErrorMessage(ErrorMessages.Unknown));
        },
        share: true,
    });

    // Use cookies to properly render theme
    const [cookies] = useCookies(["theme"]);
    useEffect(() => {
        cookies.theme && dispatch(setTheme(parseInt(cookies.theme)));
    });

    return (
        <RouterProvider router={router}/>
    );
}

export default App;
