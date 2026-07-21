import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFreSjc0Kt6lG_RIOqzzRZl7F2FEbygWY",
  authDomain: "monthly-duty-ot-record.firebaseapp.com",
  projectId: "monthly-duty-ot-record",
  storageBucket: "monthly-duty-ot-record.firebasestorage.app",
  messagingSenderId: "9991263889",
  appId: "1:9991263889:web:dc67414f3e9e2088a9d130"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

window.firebaseAuth = {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
window.firebaseDB = {
  db
};
console.log("✅ Firebase Ready");
console.log("🔥 Monthly Duty OT V2 Loaded");
