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
    theme: string[];
}

export const BACKGROUND_COLORS = [
    ["#bdc3c7", "#2c3e50"],
    ["#e7e9bb", "#403b4a"],
    ["#dbd5a4", "#649173"],
    ["#f29492", "#65606b"],
    ["#ef8e38", "#108dc7"],
    ["#f8ad70", "#ef6b50"],
    ["#ec6ead", "#3494e6"],
    ["#59c173", "#5d26c1"],
];

const initialState: InitialState = {
    leftTab: LeftTabs.Log,
    rightTab: RightTabs.Rooms,
    loading: true,
    theme: BACKGROUND_COLORS[0],
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
        setTheme: (state, action: PayloadAction<number>) => {
            state.theme = BACKGROUND_COLORS[action.payload];
        },
    },
});

export const { setLeftTab, setRightTab, setLoading, setLoaded, setTheme } =
    generalSlice.actions;
export default generalSlice.reducer;
