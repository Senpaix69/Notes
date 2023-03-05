import { initializeApp, getApps, getApp } from "firebase/app";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAriDlXpRqCnxCc6ZyURe5fsawvaSgznMk",
  authDomain: "notesapp-9f8e5.firebaseapp.com",
  projectId: "notesapp-9f8e5",
  storageBucket: "notesapp-9f8e5.appspot.com",
  messagingSenderId: "1048276152385",
  appId: "1:1048276152385:web:ba176eebb4d984c96c56c0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, db, storage, signInWithPopup, auth, provider, signOut };
