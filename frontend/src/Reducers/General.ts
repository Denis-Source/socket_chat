import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum LeftTabs {
  Rooms = "room_list",
  Log = "log",
}

export enum RightTabs {
  Rooms = "room_list",
  Messages = "message_list",
  Drawing = "drawing",
}

interface InitialState {
  leftTab: LeftTabs;
  rightTab: RightTabs;
  loading: boolean;
}

const initialState: InitialState = {
  leftTab: LeftTabs.Log,
  rightTab: RightTabs.Rooms,
  loading: true,
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
    setLoading: (state) => {
      // Sets app loading to true
      state.loading = true;
    },
    setLoaded: (state) => {
      // Sets app loading to false
      state.loading = false;
    },
  },
});

export const { setLeftTab, setRightTab, setLoading, setLoaded } =
  generalSlice.actions;
export default generalSlice.reducer;
