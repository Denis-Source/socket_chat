import { TypeStatements } from "./StatementsTypes/TypeStatements";
import { MessageStatements } from "./StatementsTypes/MessageStatements";
import { RoomStatements } from "./StatementsTypes/RoomStatements";
import { UserStatements } from "./StatementsTypes/UserStatements";
import { LogModel, LogOrigin } from "./Models/Log.model";
import store from "./store";
import { addLog } from "./Reducers/Log";
import { DrawingStatements } from "./StatementsTypes/DrawingStatements";

// export const WSS_FEED_URL = "ws://localhost:9000";
export const WSS_FEED_URL = "wss://chat.zoloto.cx.ua/api";

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
