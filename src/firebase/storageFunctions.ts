import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const STATE_CHANGED = "state_changed";

const uploadFile = (fileRef: string, file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, fileRef);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return { uploadTask, storageRef };
};

export { uploadFile, STATE_CHANGED };
