import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RoomModel} from "../Molels/Room.model";

type InitialState = {
    list: RoomModel[],
    current: RoomModel | null,
}

const initialState: InitialState = {
    list: [],
    current: null
}

export const roomSlice = createSlice({
    name: "room",
    initialState: initialState,
    reducers: {
        addBulkRoom: (state, action: PayloadAction<RoomModel[]>) => {
            state.list = [...action.payload]
        },
        addRoom: (state, action: PayloadAction<RoomModel>) => {
            state.list.push(action.payload);
        },
        updateRoom: (state, action: PayloadAction<RoomModel>) => {
            state.list =
                [...state.list.map(room => room.uuid === action.payload.uuid ? action.payload : room)]
            if (state.current?.uuid === action.payload.uuid) {
                state.current = action.payload;
            }
        },
        enterRoom: (state, action: PayloadAction<RoomModel>) => {
            state.current = action.payload;
        },
        removeRoom: (state, action: PayloadAction<RoomModel>) => {
            state.list = state.list.filter(room => room.uuid !== action.payload.uuid);
        },
        leaveRoom: (state) => {
            state.current = null;
        }
    },
})

export const {addBulkRoom, updateRoom, enterRoom, addRoom, removeRoom, leaveRoom} = roomSlice.actions
export default roomSlice.reducer