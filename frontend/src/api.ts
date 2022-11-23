import { TypeStatements } from "./StatementsTypes/TypeStatements";
import { MessageStatements } from "./StatementsTypes/MessageStatements";
import { RoomStatements } from "./StatementsTypes/RoomStatements";
import { UserStatements } from "./StatementsTypes/UserStatements";
import { LogModel, LogOrigin } from "./Models/Log.model";
import store from "./store";
import { addLog } from "./Reducers/Log";
import { DrawingStatements } from "./StatementsTypes/DrawingStatements";
import { setUser } from "./Reducers/User";
import {
    addBulkRoom,
    addRoom,
    leaveRoom,
    removeRoom,
    updateRoom,
} from "./Reducers/Room";
import { addMessage, bulkAddMessage } from "./Reducers/Message";
import { addDrawingLine, setDrawing } from "./Reducers/Drawing";

export const WSS_FEED_URL = "ws://localhost:9000";
// export const WSS_FEED_URL = "wss://chat.zoloto.cx.ua/api";

export interface StatementParts {
    type: TypeStatements;
    message:
        | MessageStatements
        | RoomStatements
        | UserStatements
        | DrawingStatements;
    name?: string;
    body?: string;
    uuid?: string;
    color?: string;
    points?: any;
    tool?: string;
}

export const processMessage = (data: any) => {
    /*
        Processes the incoming data
        Adds log item to the state
    */

    // Get type of the message and payload
    const type = data.payload.message;
    const payload = data.payload;

    // Add log item to the state
    store.dispatch(
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
            store.dispatch(setUser(payload.object));
            break;
        case UserStatements.UserChanged:
            store.dispatch(setUser(payload.object));
            break;
        case RoomStatements.RoomsListed:
            store.dispatch(addBulkRoom(data.payload.list));
            break;
        case RoomStatements.RoomCreated:
            store.dispatch(addRoom(data.payload.object));
            break;
        case RoomStatements.RoomDeleted:
            store.dispatch(removeRoom(data.payload.object));
            break;
        case RoomStatements.RoomLeft:
            store.dispatch(leaveRoom());
            break;
        case RoomStatements.RoomChanged:
            store.dispatch(updateRoom(data.payload.object));
            break;
        case MessageStatements.MessageListed:
            store.dispatch(bulkAddMessage(data.payload.list));
            break;
        case MessageStatements.MessageCreated:
            store.dispatch(addMessage(data.payload.object));
            break;
        case DrawingStatements.DrawingGot:
            store.dispatch(setDrawing(data.payload.object));
            break;
        case DrawingStatements.DrawLineChanged:
            store.dispatch(addDrawingLine(data.payload.object));
            break;
    }
};

export const prepareStatement = (parts: StatementParts) => {
    /*
    Construct the statements in the correct form
    Add log item to the state
  */

    const newLog: LogModel = {
        type: parts.type,
        time: new Date().toLocaleTimeString(),
        origin: LogOrigin.Sent,
        description: parts.message,
    };

    // Add log item directly to the state
    // As the function is not in the component/hook
    store.dispatch(addLog(newLog));

    return {
        type: parts.type,
        payload: {
            message: parts.message,
            body: parts?.body,
            name: parts?.name,
            uuid: parts?.uuid,
            color: parts?.color,
            tool: parts?.tool,
            points: parts?.points,
        },
    };
};
