import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStateType } from "../../utils/types";

const initialState: UserStateType = {
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
  followedBy: [],
  following: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<UserStateType>) {
      state.uid = action.payload.uid;
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.photoURL = action.payload.photoURL;
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
