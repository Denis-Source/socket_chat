import {configureStore} from "@reduxjs/toolkit";
import messageReducer from "./Reducers/Message";
import userReducer from "./Reducers/User"
import roomReducer from "./Reducers/Room"

export default configureStore({
    reducer: {
        message: messageReducer,
        user: userReducer,
        room: roomReducer
    },
})
