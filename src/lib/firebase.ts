
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-nVUvhTlHKFvbuoDL0yQPTHqDcbCkv7k",
  authDomain: "mining-6efe8.firebaseapp.com",
  projectId: "mining-6efe8",
  storageBucket: "mining-6efe8.firebasestorage.app",
  messagingSenderId: "1028644513915",
  appId: "1:1028644513915:web:8e3304deae9222d3005ade",
  measurementId: "G-QTQL8SHGWQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
