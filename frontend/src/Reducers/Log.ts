import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogModel } from "../Models/Log.model";
import { TypeStatements } from "../StatementsTypes/TypeStatements";

type InitialState = {
    list: LogModel[];
    lastCall: string;
    lastError: string;
    lastResult: string;
};

const initialState: InitialState = {
    list: [],
    lastResult: "",
    lastCall: "",
    lastError: "",
};

export const logSlice = createSlice({
    name: "log",
    initialState: initialState,
    reducers: {
        addLog: (state, action: PayloadAction<LogModel>) => {
            // Add log message to the list, cut if too many
            // Add only if different

            switch (action.payload.type) {
                case TypeStatements.Result:
                    if (action.payload.description !== state.lastResult) {
                        state.list = [...state.list, action.payload];
                        state.lastResult = action.payload.description;
                    }
                    break;
                case TypeStatements.Error:
                    if (action.payload.description !== state.lastError) {
                        state.list = [...state.list, action.payload];
                        state.lastError = action.payload.description;
                    }
                    break;
                case TypeStatements.Call:
                    if (action.payload.description !== state.lastCall) {
                        state.list = [...state.list, action.payload];
                        state.lastCall = action.payload.description;
                    }
                    break;
            }
        },
    },
});

export const { addLog } = logSlice.actions;
export default logSlice.reducer;
