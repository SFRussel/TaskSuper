// src/services/authService.js
// Authentication service for user login, register, and logout
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Register new user
export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, {
      displayName: username
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      username: username,
      photoURL: null,
      backgroundImage: null,
      createdAt: new Date().toISOString(),
      notifications: {
        email: true,
        deadline: true
      }
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload profile picture (using URL instead of file upload)
// Users can paste image URLs from services like Imgur, etc.
export const uploadProfilePicture = async (uid, imageUrl) => {
  try {
    await updateUserProfile(uid, { photoURL: imageUrl });
    return { success: true, photoURL: imageUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload background image (using URL instead of file upload)
export const uploadBackgroundImage = async (uid, imageUrl) => {
  try {
    await updateUserProfile(uid, { backgroundImage: imageUrl });
    return { success: true, backgroundImage: imageUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
