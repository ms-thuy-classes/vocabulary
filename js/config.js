// Firebase Config - Replace with your actual config
export const firebaseConfig = {
  apiKey: "AIzaSyCt1a3SGuac8srDDC76T2I1yGla8tpfbPg",
  authDomain: "vocab-64644.firebaseapp.com",
  databaseURL: "https://vocab-64644-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vocab-64644",
  storageBucket: "vocab-64644.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

export const DB_PATHS = {
  USER: (uid) => `users/${uid}`,
  DATA: (uid) => `users/${uid}/data`,
  PROFILE: (uid) => `users/${uid}/profile`
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Export Firebase functions for use in other modules
export { 
  ref, set, get, onValue, push, update, remove, serverTimestamp,
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
// ✅ ĐÚNG (chỉ export 1 lần):
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,  // ← Export 1 lần duy nhất ở đây
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

export { 
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
