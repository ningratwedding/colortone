'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

// Helper function to create a user document in Firestore
async function createUserDocument(user: any) {
    const db = useFirestore();
    const userRef = doc(db, 'users', user.uid);
    const userData = {
        name: user.displayName || 'Unnamed User',
        email: user.email,
        slug: user.uid, // Using UID as slug for simplicity
        role: 'pembeli',
    };
    await setDoc(userRef, userData, { merge: true });
}

// Sign in with Google and create user document if it's a new user
export async function signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // You might want to check if the user is new and create a document
    // For simplicity, we'll just ensure a document exists.
    await createUserDocument(user);

    return { success: true, user };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, fullName: string) {
    const auth = getAuth();
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Add full name to user object before creating document
        const userWithProfile = { ...user, displayName: fullName };
        await createUserDocument(userWithProfile);

        return { success: true, user: userWithProfile };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
    const auth = getAuth();
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred.' };
    }
}


// Sign out
export async function signOut() {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
