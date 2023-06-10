import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string | null;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

const initialState: User = {
  uid: null,
  name: null,
  email: null,
  photoURL: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<User>) {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photoURL = action.payload.photoURL;
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
