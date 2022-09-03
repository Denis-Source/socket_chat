import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum LeftTabs {
  Rooms = "room_list",
  Log = "log",
}

export enum RightTabs {
  Rooms = "room_list",
  Messages = "message_list",
}

interface InitialState {
  leftTab: LeftTabs;
  rightTab: RightTabs;
}

const initialState: InitialState = {
  leftTab: LeftTabs.Log,
  rightTab: RightTabs.Rooms,
};

export const generalSlice = createSlice({
  name: "general",
  initialState: initialState,
  reducers: {
    setLeftTab: (state, action: PayloadAction<LeftTabs>) => {
      // Switches the left tab
      state.leftTab = action.payload;
    },
    setRightTab: (state, action: PayloadAction<RightTabs>) => {
      // Switches the right tab
      state.rightTab = action.payload;
    },
  },
});

export const { setLeftTab, setRightTab } = generalSlice.actions;
export default generalSlice.reducer;
