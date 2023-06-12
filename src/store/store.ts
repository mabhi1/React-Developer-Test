import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import userPostsReducer from "./slices/userPostsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userPosts: userPostsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
