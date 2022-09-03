import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { UserModel } from "../Models/User.model";

enableMapSet();

type UserState = {
  user: UserModel | null;
};

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    // Set the user to the provided one
    setUser: (state, action: PayloadAction<UserModel>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
