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
}: {
  id: string;
  title?: string;
  description?: string;
  imageURL?: string;
}) => {
  const db = getFirestore();
  const post = await getDoc(doc(db, "posts", id));
  if (!post.exists()) return false;
  const postData: PostType = post.data() as PostType;
  const newTitle = title ? title : postData.title;
  const newDescription = description ? description : postData.description;
  const newImageList = imageURL ? [...postData.images, imageURL] : postData.images;

  const editedPost = doc(db, "posts", id);
  try {
    await updateDoc(editedPost, {
      ...postData,
      title: newTitle,
      description: newDescription,
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
  if (post.exists()) return { ...post.data(), id: post.id } as PostType & { id: string };
  else return null;
};

const getUserPosts = async (uid: string) => {
  const db = getFirestore();
  const userPosts: (PostType & { id: string })[] = [];
  const postsQuery = query(
    collection(db, "posts"),
    where("uploadedBy.userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const postsData = await getDocs(postsQuery);
  postsData.forEach((doc) => {
    if (doc.exists()) {
      const eachPost = { ...doc.data(), id: doc.id } as PostType & { id: string };
      userPosts.push({ ...eachPost });
    }
  });
  return userPosts;
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

export { createPost, getPost, updatePost, getUserPosts, deletePost };
