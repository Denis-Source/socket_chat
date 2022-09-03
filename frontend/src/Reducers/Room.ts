import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RoomModel} from "../Models/Room.model";

const MAX_ROOMS = 100;

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
            // Add rooms in bulk, cut if too many
            state.list = [...action.payload].slice(-MAX_ROOMS);
        },
        addRoom: (state, action: PayloadAction<RoomModel>) => {
            // add room to the list, cut if too many
            state.list = [...state.list, action.payload].slice(-MAX_ROOMS);
        },
        updateRoom: (state, action: PayloadAction<RoomModel>) => {
            // Update the specified room in the list by uuid
            // Update also the current room
            // It's unfortunate that the <Map> class cannot be used in redux states
            state.list =
                [...state.list.map(
                    room => room.uuid === action.payload.uuid
                        ? action.payload
                        : room
                )]

            if (state.current?.uuid === action.payload.uuid) {
                state.current = action.payload;
            }
        },
        enterRoom: (state, action: PayloadAction<RoomModel>) => {
            // Set the current room to the provided one
            state.current = action.payload;
        },
        removeRoom: (state, action: PayloadAction<RoomModel>) => {
            // Delete the specified room
            // It's unfortunate that the <Map> class cannot be used in redux states
            state.list = state.list.filter(
                room => room.uuid !== action.payload.uuid
            );
        },
        leaveRoom: (state) => {
            // Set the current room to a blank value
            state.current = null;
        }
    },
})

export const {addBulkRoom, updateRoom, enterRoom, addRoom, removeRoom, leaveRoom} = roomSlice.actions
export default roomSlice.reducer