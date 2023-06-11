import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
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
    return false;
  }
};

const getUser = async (uid: string) => {
  const db = getFirestore();
  const user = await getDoc(doc(db, "users", uid));
  if (user.exists()) return { ...user.data() } as createdDBUserType;
  else return null;
};

export { createUserDB, updateUser, getUser };
