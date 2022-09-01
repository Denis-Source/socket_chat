import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {enableMapSet} from 'immer';
import {UserModel} from "../Molels/User.model";

enableMapSet();

type UserState = {
    user: UserModel | null;
}

const initialState: UserState = {
    user: null
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        set: (state, action: PayloadAction<UserModel>) => {
            state.user = action.payload;
        },

    },
})

export const {set} = userSlice.actions
export default userSlice.reducer