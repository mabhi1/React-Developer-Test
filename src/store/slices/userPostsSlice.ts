import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../utils/types";

const initialState: PostType[] = [];

const userPostsSlice = createSlice({
  name: "userPosts",
  initialState,
  reducers: {
    addUserPost(state, action: PayloadAction<PostType>) {
      state.map((post, index) => {
        if (post.id === action.payload.id) {
          state.splice(index, 1);
          return;
        }
      });
      state.push({ ...action.payload });
    },
    removeUserPost(state, action: PayloadAction<string>) {
      state.map((post, index) => {
        if (post.id === action.payload) {
          state.splice(index, 1);
          return;
        }
      });
    },
  },
});

export const { addUserPost, removeUserPost } = userPostsSlice.actions;
export default userPostsSlice.reducer;
