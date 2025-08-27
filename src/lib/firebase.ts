
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAOO7Gn1Y64dx_imZK0v_q_HaRzc6UYqc",
  authDomain: "earning-app-ff02b.firebaseapp.com",
  projectId: "earning-app-ff02b",
  storageBucket: "earning-app-ff02b.firebasestorage.app",
  messagingSenderId: "195041352341",
  appId: "1:195041352341:web:517d304706a851dcc7999c",
  measurementId: "G-FFVVEGQRFH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
