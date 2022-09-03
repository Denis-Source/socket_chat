import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LogModel} from "../Models/Log.model";

type InitialState = {
    list: LogModel[],
}

const initialState: InitialState = {
    list: [],
}

const LOG_LIMIT = 300;

export const logSlice = createSlice({
    name: "log",
    initialState: initialState,
    reducers: {
        addLog: (state, action: PayloadAction<LogModel>) => {
            // Add log message to the list, cut if too many
            state.list = [...state.list, action.payload].slice(-LOG_LIMIT);
        },
    },
})

export const {addLog} = logSlice.actions
export default logSlice.reducer