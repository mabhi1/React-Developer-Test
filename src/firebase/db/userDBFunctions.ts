import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { UserStateType, createdDBUserType } from "../../utils/types";

const createUserDB = async (user: UserStateType) => {
  const newUser: createdDBUserType = {
    uid: user.uid!,
    displayName: user.displayName!,
    photoURL: user.photoURL!,
    email: user.email!,
    followedBy: [],
    following: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const db = getFirestore();
  try {
    if ((await getDoc(doc(db, "users", user.uid!))).exists()) return false;
    await setDoc(doc(db, "users", user.uid!), newUser);
  } catch (error) {
    throw new Error();
  }
};

const updateUser = async ({
  uid,
  displayName,
  email,
  photoURL,
}: {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}) => {
  const db = getFirestore();
  const user = await getDoc(doc(db, "users", uid!));
  if (!user.exists()) return false;
  const userData: createdDBUserType = user.data() as createdDBUserType;
  const newDisplayName = displayName ? displayName : userData.displayName;
  const newEmail = email ? email : userData.email;
  const newPhotoURL = photoURL ? photoURL : userData.photoURL;

  const editedUser = doc(db, "users", uid!);
  try {
    await updateDoc(editedUser, {
      ...userData,
      displayName: newDisplayName,
      email: newEmail,
      photoURL: newPhotoURL,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    throw new Error();
  }
};

const getUser = async (uid: string) => {
  const db = getFirestore();
  try {
    const user = await getDoc(doc(db, "users", uid));
    if (user.exists()) return { ...user.data() } as createdDBUserType;
    else return null;
  } catch (error) {
    throw new Error();
  }
};

const followUser = async (userId: string, followerId: string) => {
  const db = getFirestore();
  const user = await getDoc(doc(db, "users", userId));
  const follower = await getDoc(doc(db, "users", followerId));
  if (!user.exists() || !follower.exists()) throw new Error();

  let newFollowedByList: string[] = [...user.data().followedBy, followerId];
  let newFollowingList: string[] = [...follower.data().following, userId];

  const editedUser = doc(db, "users", userId);
  const editedFollower = doc(db, "users", followerId);

  try {
    await updateDoc(editedUser, {
      ...user.data(),
      followedBy: newFollowedByList,
    });
    await updateDoc(editedFollower, {
      ...follower.data(),
      following: newFollowingList,
    });
    return true;
  } catch (error) {
    throw new Error();
  }
};

const unfollowUser = async (userId: string, followerId: string) => {
  const db = getFirestore();
  const user = await getDoc(doc(db, "users", userId));
  const follower = await getDoc(doc(db, "users", followerId));
  if (!user.exists() || !follower.exists()) throw new Error();

  let newFollowedByList: string[] = user.data().followedBy.filter((follower: string) => follower !== followerId);
  let newFollowingList: string[] = follower.data().following.filter((follow: string) => follow !== userId);

  const editedUser = doc(db, "users", userId);
  const editedFollower = doc(db, "users", followerId);

  try {
    await updateDoc(editedUser, {
      ...user.data(),
      followedBy: newFollowedByList,
    });
    await updateDoc(editedFollower, {
      ...follower.data(),
      following: newFollowingList,
    });
    return true;
  } catch (error) {
    throw new Error();
  }
};

const getUsersByQuery = async (term: string) => {
  const db = getFirestore();
  const users: createdDBUserType[] = [];
  const userQuery = query(collection(db, "users"), where("email", "==", term), orderBy("createdAt", "desc"));
  const usersData = await getDocs(userQuery);
  usersData.forEach((doc) => {
    if (doc.exists()) {
      const eachUser = { ...doc.data() } as createdDBUserType;
      users.push({ ...eachUser });
    }
  });
  return users;
};

export { createUserDB, updateUser, getUser, followUser, unfollowUser, getUsersByQuery };
