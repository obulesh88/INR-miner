
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoVmI-pLYqVyQR6_lLOhlid--BawiZsVQ",
  authDomain: "orgames-98fa4.firebaseapp.com",
  projectId: "orgames-98fa4",
  storageBucket: "orgames-98fa4.appspot.com",
  messagingSenderId: "328449367481",
  appId: "1:328449367481:web:70ece6ec7b39b0cbecaa68",
  measurementId: "G-9BDNY7ZJYH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
