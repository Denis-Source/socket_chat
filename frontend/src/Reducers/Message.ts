import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {MessageModel} from "../Molels/Message.model";

export const messageSlice = createSlice({
    name: "message",
    initialState: {
        history: new Array<MessageModel>()
    },
    reducers: {
        clear: (state) => {
            state.history = []
        },
        add: (state, action: PayloadAction<MessageModel>) => {
            state.history.push(action.payload);
        },
        bulkSet: (state, action: PayloadAction<MessageModel[]>) => {
            state.history = [...action.payload]
        },
        update: (state, action: PayloadAction<MessageModel>) => {
            state.history =
                [...state.history.map(message => message.uuid === action.payload.uuid ? action.payload : message)]
        }
    },
})

export const {clear, add, bulkSet, update} = messageSlice.actions
export default messageSlice.reducer