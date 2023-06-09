import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string | null;
  email: string | null;
}

const initialState: User = {
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<User>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
