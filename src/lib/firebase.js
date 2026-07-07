import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYTN-kfm21hEnj8Wuc6o_vQcZcgsaIGKA",
  authDomain: "portfolio-rakha.firebaseapp.com",
  projectId: "portfolio-rakha",
  storageBucket: "portfolio-rakha.firebasestorage.app",
  messagingSenderId: "961483684017",
  appId: "1:961483684017:web:7e926bf791936e635a4a90",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
