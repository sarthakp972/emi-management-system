// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_ALT,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_ALT,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_ALT,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_ALT,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_ALT,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_ALT,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_ALT,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app); // Firestore database
export const auth = getAuth(app); // Firebase authentication
export const storage = getStorage(app); // Firebase storage
export const realtimeDB = getDatabase(app); // Realtime database
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" }); 
export default app;