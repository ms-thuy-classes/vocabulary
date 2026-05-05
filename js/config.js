// Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyCt1a3SGuac8srDDC76T2I1yGla8tpfbPg",
  authDomain: "vocab-64644.firebaseapp.com",
  databaseURL: "https://vocab-64644-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vocab-64644",
  storageBucket: "vocab-64644.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
export const app = initializeApp(firebaseConfig);

// Database
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
export const db = getDatabase(app);

// Auth - IMPORT 1 LẦN DUY NHẤT
import { 
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

export const auth = getAuth(app);

// Export các functions (KHÔNG export lại getAuth)
export {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};

// Database functions
export {
  ref,
  set,
  get,
  onValue,
  push,
  update,
  remove,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
