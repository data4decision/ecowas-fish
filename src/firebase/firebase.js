// src/firebase/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApvEwO3jDaBxO1kRuRcotdZdmalpPNK6A",
  authDomain: "ecowas-fisheries.firebaseapp.com",
  projectId: "ecowas-fisheries",
  storageBucket: "ecowas-fisheries.appspot.com", // ← FIXED typo from `.firebasestorage.app` to `.appspot.com`
  messagingSenderId: "939774661663",
  appId: "1:939774661663:web:15e5f085df0dbf8965712a",
  measurementId: "G-PFFB4GKE8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export the services you need
export { auth, db, storage, analytics };
