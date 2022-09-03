import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "../Models/Message.model";

const MESSAGE_LIMIT = 200;

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    list: new Array<MessageModel>(),
  },
  reducers: {
    clearMessages: (state) => {
      // Clear the message list
      state.list = [];
    },
    addMessage: (state, action: PayloadAction<MessageModel>) => {
      // Add message to the list, cut if too many
      state.list = [...state.list, action.payload].slice(-MESSAGE_LIMIT);
    },
    bulkAddMessage: (state, action: PayloadAction<MessageModel[]>) => {
      // Add messages to the list in bulk, cuts if too many
      state.list = [...action.payload].slice(-MESSAGE_LIMIT);
    },
    updateMessage: (state, action: PayloadAction<MessageModel>) => {
      // Update the specified message in the list by uuid
      // It's unfortunate that the <Map> class cannot be used in redux states
      state.list = [
        ...state.list.map((message) =>
          message.uuid === action.payload.uuid ? action.payload : message
        ),
      ];
    },
  },
});

export const { clearMessages, addMessage, bulkAddMessage, updateMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
