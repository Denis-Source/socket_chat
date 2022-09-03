import {TypeStatements} from "./StatementsTypes/TypeStatements";
import {MessageStatements} from "./StatementsTypes/MessageStatements";
import {RoomStatements} from "./StatementsTypes/RoomStatements";
import {UserStatements} from "./StatementsTypes/UserStatements";
import {LogModel, LogOrigin} from "./Models/Log.model";
import store from "./store";
import {addLog} from "./Reducers/Log";

export const WSS_FEED_URL = "ws://localhost:9000";
// export const WSS_FEED_URL = "wss://chat.zoloto.cx.ua/api";

export interface StatementParts {
    type: TypeStatements,
    message: MessageStatements|RoomStatements|UserStatements,
    name?: string,
    body?: string,
    uuid?: string,
}

export const prepareStatement = (parts: StatementParts) => {
    const newLog: LogModel  = {
        type: parts.type,
        time: new Date().toTimeString(),
        origin: LogOrigin.Received,
        description: parts.message
    }

    store.dispatch(addLog(newLog));

    return {
        type: parts.type,
        payload: {
            message: parts.message,
            body: parts?.body,
            name: parts?.name,
            uuid: parts?.uuid,
        }
    }
}