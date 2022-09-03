import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./Reducers/Message";
import userReducer from "./Reducers/User";
import roomReducer from "./Reducers/Room";
import generalReducer from "./Reducers/General";
import logReducer from "./Reducers/Log";

export default configureStore({
  reducer: {
    message: messageReducer,
    user: userReducer,
    room: roomReducer,
    general: generalReducer,
    log: logReducer,
  },
});
