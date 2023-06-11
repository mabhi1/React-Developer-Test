import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import userPostsReducer from "./slices/userPostsSlice";
import followedUsersReducer from "./slices/followedUsersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userPosts: userPostsReducer,
    followedPosts: followedUsersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
