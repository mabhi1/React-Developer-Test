import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
}

const initialState: User = {
  name: "",
  email: "",
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
