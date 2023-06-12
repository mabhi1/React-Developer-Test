import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  where,
  query,
  collection,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidV4 } from "uuid";
import { CreatedPostType, PostType, UserStateType } from "../../utils/types";

const createPost = async (user: UserStateType, title: string, description: string) => {
  if (!user.uid) return;
  const post: CreatedPostType = {
    title,
    description,
    images: [],
    likes: [],
    dislikes: [],
    comments: [],
    uploadedBy: {
      name: user.displayName!,
      userId: user.uid!,
      photoURL: user.photoURL!,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const db = getFirestore();
  const currentId = uuidV4();
  try {
    await setDoc(doc(db, "posts", currentId), post);
    const createdPost = await getDoc(doc(db, "posts", currentId));
    return { ...createdPost.data(), id: createdPost.id } as PostType;
  } catch (error) {
    throw new Error();
  }
};

const updatePost = async ({
  id,
  title,
  description,
  imageURL,
  comment,
}: {
  id: string;
  title?: string;
  description?: string;
  imageURL?: string;
  comment?: any;
}) => {
  const db = getFirestore();
  const post = await getDoc(doc(db, "posts", id));
  if (!post.exists()) return false;
  const postData: PostType = post.data() as PostType;
  const newTitle = title ? title : postData.title;
  const newDescription = description ? description : postData.description;
  const newImageList = imageURL ? [...postData.images, imageURL] : postData.images;
  const newComments = comment ? [...postData.comments, comment] : postData.comments;

  const editedPost = doc(db, "posts", id);
  try {
    await updateDoc(editedPost, {
      ...postData,
      title: newTitle,
      description: newDescription,
      images: newImageList,
      comments: newComments,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    return false;
  }
};

const deleteImage = async (imageURL: string, postId: string) => {
  const db = getFirestore();
  const post = await getDoc(doc(db, "posts", postId));
  if (!post.exists()) return false;
  const postData: PostType = post.data() as PostType;
  const editedPost = doc(db, "posts", postId);
  const newImageList = postData.images.filter((image) => image !== imageURL);
  try {
    await updateDoc(editedPost, {
      ...postData,
      images: newImageList,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getPost = async (id: string) => {
  const db = getFirestore();
  const post = await getDoc(doc(db, "posts", id));
  if (post.exists()) return { ...post.data(), id: post.id } as PostType;
  else return null;
};

const getUserPosts = async (uid: string) => {
  const db = getFirestore();
  const userPosts: PostType[] = [];
  const postsQuery = query(
    collection(db, "posts"),
    where("uploadedBy.userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const postsData = await getDocs(postsQuery);
  postsData.forEach((doc) => {
    if (doc.exists()) {
      const eachPost = { ...doc.data(), id: doc.id } as PostType;
      userPosts.push({ ...eachPost });
    }
  });
  return userPosts;
};

const getFeedPosts = async (users: string[]) => {
  let feedList: PostType[] = [];
  for (let i = 0; i < users.length; i++) {
    const userPosts = await getUserPosts(users[i]);
    feedList.push(...userPosts);
  }
  return feedList;
};

const deletePost = async (id: string) => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, "posts", id));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const likePost = async (userId: string, postId: string) => {
  const db = getFirestore();
  const postData = (await getDoc(doc(db, "posts", postId))).data() as PostType;

  const newDislikeList = postData.dislikes.filter((user) => user !== userId);
  let newLikeList = postData.likes;
  if (newLikeList.includes(userId)) newLikeList = newLikeList.filter((user) => user !== userId);
  else newLikeList.push(userId);

  const editedPost = doc(db, "posts", postId);
  try {
    await updateDoc(editedPost, {
      ...postData,
      likes: newLikeList,
      dislikes: newDislikeList,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    return false;
  }
};

const dislikePost = async (userId: string, postId: string) => {
  const db = getFirestore();
  const postData = (await getDoc(doc(db, "posts", postId))).data() as PostType;

  const newLikeList = postData.likes.filter((user) => user !== userId);
  let newDislikeList = postData.dislikes;
  if (newDislikeList.includes(userId)) newDislikeList = newDislikeList.filter((user) => user !== userId);
  else newDislikeList.push(userId);

  const editedPost = doc(db, "posts", postId);
  try {
    await updateDoc(editedPost, {
      ...postData,
      likes: newLikeList,
      dislikes: newDislikeList,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getPostsByQuery = async (term: string) => {
  const db = getFirestore();
  const posts: PostType[] = [];
  const postQuery = query(collection(db, "posts"), where("title", "==", term), orderBy("createdAt", "desc"));
  const postsData = await getDocs(postQuery);
  postsData.forEach((doc) => {
    if (doc.exists()) {
      const eachPost = { ...doc.data() } as PostType;
      posts.push({ ...eachPost });
    }
  });
  return posts;
};

export {
  createPost,
  getPost,
  updatePost,
  getUserPosts,
  getFeedPosts,
  deletePost,
  deleteImage,
  likePost,
  dislikePost,
  getPostsByQuery,
};
