import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../utils/types";

const initialState: PostType[] = [];

const userPostsSlice = createSlice({
  name: "userPosts",
  initialState,
  reducers: {
    initializeUsersPosts(state) {
      state = [];
      return state;
    },
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
    removeImageFromPost(state, action: PayloadAction<{ postId: string; imageURL: string }>) {
      state = state.map((post) => {
        if (post.id === action.payload.postId) {
          post.images = post.images.filter((image) => image !== action.payload.imageURL);
          post.updatedAt = Date.now();
        }
        return post;
      });
    },
  },
});

export const { addUserPost, removeUserPost, removeImageFromPost, initializeUsersPosts } = userPostsSlice.actions;
export default userPostsSlice.reducer;
