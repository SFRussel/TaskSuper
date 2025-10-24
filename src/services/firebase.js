// src/services/firebase.js
// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDhz9p6bz9NiYVw3rN03pPBqH5ks5qDuvo",
  authDomain: "task-management-database-7548c.firebaseapp.com",
  projectId: "task-management-database-7548c",
  storageBucket: "task-management-database-7548c.firebasestorage.app",
  messagingSenderId: "488621160909",
  appId: "1:488621160909:web:dd389703ee01a14e772c84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
