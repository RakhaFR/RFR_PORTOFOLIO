// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Kredensial asli punya Rakha
const firebaseConfig = {
  apiKey: "AIzaSyDYTN-kfm21hEnj8Wuc6o_vQcZcgsaIGKA",
  authDomain: "portfolio-rakha.firebaseapp.com",
  projectId: "portfolio-rakha",
  storageBucket: "portfolio-rakha.firebasestorage.app",
  messagingSenderId: "961483684017",
  appId: "1:961483684017:web:7e926bf791936e635a4a90"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi service yang lu butuhin & export agar bisa diimport di file komponen lain
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();