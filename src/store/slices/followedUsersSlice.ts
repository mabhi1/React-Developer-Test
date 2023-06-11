import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../utils/types";

const initialState: PostType[] = [];

const followedPostsSlice = createSlice({
  name: "followedPosts",
  initialState,
  reducers: {
    updateFollowedPosts(state, action: PayloadAction<PostType>) {
      state.push({ ...action.payload });
    },
  },
});

export const { updateFollowedPosts } = followedPostsSlice.actions;
export default followedPostsSlice.reducer;
