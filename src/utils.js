import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebaseConfig";
import { uuidv4 } from "@firebase/util";

export const formatDate = (dateString = new Date()) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    new Date(dateString).toLocaleDateString("en-US", options) +
    ", " +
    new Date().toLocaleTimeString()
  );
};

export const deleteFile = async (url) => {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};

export const uploadFile = async (file, name) => {
  const storageRef = ref(storage, `${name}_data/${name + uuidv4()}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error.message);
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (error) {
          console.log(error.message);
          reject(error);
        }
      }
    );
  });
};
