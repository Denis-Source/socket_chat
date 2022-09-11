import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "../Models/Message.model";

const MESSAGE_LIMIT = 200;

interface InitialState {
    list: MessageModel[] | null;
    isNew: boolean;
}

const initialState: InitialState = {
    list: null,
    isNew: false,
};

export const messageSlice = createSlice({
    name: "message",
    initialState: initialState,
    reducers: {
        clearMessages: (state) => {
            // Clear the message list
            state.list = [];
        },
        addMessage: (state, action: PayloadAction<MessageModel>) => {
            if (state.list) {
                // Add message to the list, cut if too many
                state.list = [...state.list, action.payload].slice(
                    -MESSAGE_LIMIT
                );
                state.isNew = true;
            }
        },
        bulkAddMessage: (state, action: PayloadAction<MessageModel[]>) => {
            // Add messages to the list in bulk, cuts if too many
            state.list = [...action.payload].slice(-MESSAGE_LIMIT);
        },
        updateMessage: (state, action: PayloadAction<MessageModel>) => {
            // Update the specified message in the list by uuid
            // It's unfortunate that the <Map> class cannot be used in redux states
            if (state.list) {
                state.list = [
                    ...state.list.map((message) =>
                        message.uuid === action.payload.uuid
                            ? action.payload
                            : message
                    ),
                ];
            }
        },
        setNew: (state) => {
            state.isNew = false;
        },
        resetMessages: (state) => {
            state.list = null;
        },
    },
});

export const {
    clearMessages,
    addMessage,
    bulkAddMessage,
    updateMessage,
    resetMessages,
    setNew,
} = messageSlice.actions;
export default messageSlice.reducer;
