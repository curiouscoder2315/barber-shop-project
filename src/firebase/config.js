import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// REPLACE THESE WITH YOUR KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBPo105-KAU6jugvqHQDRyDSFZvJfEfXmw",
  authDomain: "barberapp-4b8e5.firebaseapp.com",
  projectId: "barberapp-4b8e5",
  storageBucket: "barberapp-4b8e5.firebasestorage.app",
  messagingSenderId: "399150734128",
  appId: "1:399150734128:web:3b7783e7ab3c02f74ac6f5",
  measurementId: "G-QTT78D2VBP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);