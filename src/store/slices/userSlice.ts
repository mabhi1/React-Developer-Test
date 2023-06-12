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
      state.followedBy = action.payload.followedBy || [];
      state.following = action.payload.following || [];
    },
    addFollowing(state, action: PayloadAction<string>) {
      const newFollowingList = [...state.following!.filter((id) => id !== action.payload), action.payload];
      state.following = newFollowingList;
    },
    removeFollowing(state, action: PayloadAction<string>) {
      const newFollowingList = [...state.following!.filter((id) => id !== action.payload)];
      state.following = newFollowingList;
    },
  },
});

export const { updateUser, addFollowing, removeFollowing } = userSlice.actions;
export default userSlice.reducer;
