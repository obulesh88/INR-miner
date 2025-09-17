
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, Firestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNvOgsy2AZh9b5DxVMLNhBZAB4gKPIj70",
  authDomain: "earningapp-cf1cd.firebaseapp.com",
  projectId: "earningapp-cf1cd",
  storageBucket: "earningapp-cf1cd.firebasestorage.app",
  messagingSenderId: "651499379090",
  appId: "1:651499379090:web:b569b17072c27814cac94b",
  measurementId: "G-4E5TPKMM8P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with offline persistence
let db: Firestore;

if (typeof window !== 'undefined') {
  // Client-side initialization
  db = initializeFirestore(app, {});
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log("Persistence failed: Multiple tabs open");
    } else if (err.code === 'unimplemented') {
      console.log("Persistence is not supported in this browser");
    }
  });
} else {
  // Server-side initialization
  db = getFirestore(app);
}


export { app, auth, db };
