// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore"; // Importera typerna

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_APP_ID as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);