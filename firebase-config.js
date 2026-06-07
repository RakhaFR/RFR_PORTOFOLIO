/**
 * Firebase Configuration for Rakha FR Portfolio Chat Room
 * 
 * Silakan ganti nilai di dalam `firebaseConfig` di bawah ini dengan kredensial
 * yang Anda dapatkan dari Firebase Console Anda (Project Settings > General).
 */
const firebaseConfig = {
  apiKey: "AIzaSyDYTN-kfm21hEnj8Wuc6o_vQcZcgsaIGKA",
  authDomain: "portfolio-rakha.firebaseapp.com",
  projectId: "portfolio-rakha",
  storageBucket: "portfolio-rakha.firebasestorage.app",
  messagingSenderId: "961483684017",
  appId: "1:961483684017:web:7e926bf791936e635a4a90"
};

// Pastikan library firebase SDK sudah termuat di index.html sebelum file ini dijalankan
if (typeof firebase !== 'undefined') {
  // Inisialisasi Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Inisialisasi Auth & Firestore
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Setup Google Auth Provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  // Expose ke window/global scope agar dapat diakses dari script.js
  window.auth = auth;
  window.db = db;
  window.googleProvider = googleProvider;
} else {
  console.error("Firebase SDK tidak ditemukan! Pastikan script Firebase di index.html dimuat dengan benar.");
}
