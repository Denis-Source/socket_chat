import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LogModel} from "../Models/Log.model";

type InitialState = {
    list: LogModel[],
}

const initialState: InitialState = {
    list: [],
}

export const logSlice = createSlice({
    name: "log",
    initialState: initialState,
    reducers: {
        addLog: (state, action: PayloadAction<LogModel>) => {
            state.list.push(action.payload)
        },
    },
})

export const {addLog} = logSlice.actions
export default logSlice.reducer