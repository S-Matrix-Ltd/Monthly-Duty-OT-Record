// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAFreSjc0Kt6lG_RIOqzzRZl7F2FEbygWY",
  authDomain: "monthly-duty-ot-record.firebaseapp.com",
  projectId: "monthly-duty-ot-record",
  storageBucket: "monthly-duty-ot-record.firebasestorage.app",
  messagingSenderId: "9991263889",
  appId: "1:9991263889:web:dc67414f3e9e2088a9d130"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ Firebase Connected Successfully");
