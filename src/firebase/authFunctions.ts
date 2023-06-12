import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import "./firebase";
import { createUserDB, updateUser } from "./db/userDBFunctions";
import { UserStateType } from "../utils/types";

const auth = getAuth();

function createErrorMessage(error: any) {
  return error.message
    .split("/")[1]
    .split(")")[0]
    .split("-")
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

async function createUser(email: string, password: string, displayName: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: displayName });
    }
    const res = await createUserDB(auth.currentUser as UserStateType);
    return res;
  } catch (error) {
    throw createErrorMessage(error);
  }
}

async function signIn(email: string, password: string) {
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function rememberSignIn(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function socialSignIn(provider: string) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, socialProvider);
      await createUserDB(auth.currentUser as UserStateType);
      return res;
    } catch (error) {
      throw createErrorMessage(error);
    }
  }
}

async function passwordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw createErrorMessage(error);
  }
}

async function dosignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    throw createErrorMessage(error);
  }
}

async function changePassword(email: string, oldPassword: string, newPassword: string) {
  try {
    if (auth.currentUser) {
      const credential = EmailAuthProvider.credential(email, oldPassword);
      const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);
      if (authenticated) {
        await updatePassword(auth.currentUser, newPassword);
      }
    }
  } catch (error) {
    throw createErrorMessage(error);
  }
}

async function updatePhoto(photoURL: string) {
  if (!auth.currentUser) return;
  try {
    await updateProfile(auth.currentUser, {
      photoURL: photoURL,
    });
    await updateUser({ uid: auth.currentUser.uid, photoURL: photoURL });
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function updateName(name: string) {
  try {
    if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: name });
  } catch (error) {
    throw createErrorMessage(error);
  }
}

export {
  createUser,
  dosignOut,
  passwordReset,
  signIn,
  changePassword,
  socialSignIn,
  updateName,
  rememberSignIn,
  updatePhoto,
};
