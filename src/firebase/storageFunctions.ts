import { deleteObject, getStorage, ref, uploadBytesResumable } from "firebase/storage";

const STATE_CHANGED = "state_changed";

const uploadFile = (fileRef: string, file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, fileRef);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return { uploadTask, storageRef };
};

const deleteFile = async (fileURL: string) => {
  const storage = getStorage();
  const fileRef = ref(storage, fileURL);
  const res = await deleteObject(fileRef);
  return res;
};

export { uploadFile, STATE_CHANGED, deleteFile };
