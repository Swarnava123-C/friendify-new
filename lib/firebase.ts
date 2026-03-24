// Enhanced Firebase configuration to fix 400 Bad Request errors
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG4a2gbbMCVUYjtYv_uFjRcu0tukw-Sa8",
  authDomain: "safariverse-2fdf5.firebaseapp.com",
  databaseURL: "https://safariverse-2fdf5-default-rtdb.firebaseio.com",
  projectId: "safariverse-2fdf5",
  storageBucket: "safariverse-2fdf5.firebasestorage.app",
  messagingSenderId: "1080598906073",
  appId: "1:1080598906073:web:d29117dc18a1865acfaac8",
  measurementId: "G-YRH6JRYQVN",
};

// Initialize Firebase with proper error handling
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firestore
  db = getFirestore(app);

  // Initialize Storage
  storage = getStorage(app);

  // Only connect to emulator in development and if explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "true"
  ) {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch (error) {
      // Firestore emulator not available, using production
    }
  }
} catch (error) {
  throw error;
}

export { db, storage };
export default app;
