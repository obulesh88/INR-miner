
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);

    enableIndexedDbPersistence(db)
        .then(() => console.log("Firestore persistence enabled"))
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Firestore persistence failed: Multiple tabs open. Persistence will be enabled in one tab only.');
            } else if (err.code == 'unimplemented') {
                console.warn('Firestore persistence is not available in this browser.');
            }
        });
} else {
    // Server-side initialization
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = initializeFirestore(app, {});
}


export { app, auth, db };
