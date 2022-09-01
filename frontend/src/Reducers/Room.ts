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
        setBulk: (state, action: PayloadAction<RoomModel[]>) => {
            state.list = [...action.payload]
        },
        add: (state, action: PayloadAction<RoomModel>) => {
            state.list.push(action.payload);
        },
        update: (state, action: PayloadAction<RoomModel>) => {
            state.list =
                [...state.list.map(room => room.uuid === action.payload.uuid ? action.payload : room)]
            if (state.current?.uuid == action.payload.uuid) {
                state.current = action.payload;
            }
        },
        enter: (state, action: PayloadAction<RoomModel>) => {
            state.current = action.payload;
        },
        remove: (state, action: PayloadAction<RoomModel>) => {
            state.list = state.list.filter(room => room.uuid !== action.payload.uuid);
        },
        leave: (state) => {
            state.current = null;
        }
    },
})

export const {setBulk, update, enter, add, remove, leave} = roomSlice.actions
export default roomSlice.reducer