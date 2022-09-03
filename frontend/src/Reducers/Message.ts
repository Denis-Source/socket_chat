import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {MessageModel} from "../Models/Message.model";

export const messageSlice = createSlice({
    name: "message",
    initialState: {
        list: new Array<MessageModel>()
    },
    reducers: {
        clearMessages: (state) => {
            state.list = []
        },
        addMessage: (state, action: PayloadAction<MessageModel>) => {
            state.list.push(action.payload);
        },
        bulkAddMessage: (state, action: PayloadAction<MessageModel[]>) => {
            state.list = [...action.payload]
        },
        updateMessage: (state, action: PayloadAction<MessageModel>) => {
            state.list =
                [...state.list.map(message => message.uuid === action.payload.uuid ? action.payload : message)]
        }
    },
})

export const {clearMessages, addMessage, bulkAddMessage, updateMessage} = messageSlice.actions
export default messageSlice.reducer