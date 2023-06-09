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
} from "firebase/auth";
import "./firebase";

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
      await signInWithPopup(auth, socialProvider);
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

async function changePassword(password: string) {
  try {
    if (auth.currentUser) await updatePassword(auth.currentUser, password);
  } catch (error) {
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

export { createUser, dosignOut, passwordReset, signIn, changePassword, socialSignIn, updateName, rememberSignIn };
