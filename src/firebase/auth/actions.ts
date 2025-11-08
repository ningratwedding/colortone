
'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Helper to get firestore instance
const getDb = () => getFirestore(initializeFirebase().app);

// Helper function to create a user document in Firestore
async function createUserDocument(user: any, fullName?: string) {
    const db = getDb();
    const userRef = doc(db, 'users', user.uid);
    const auth = getAuth(initializeFirebase().app);

    // Check if the document already exists
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // Document doesn't exist, create it
        const name = fullName || user.displayName || 'Pengguna Baru';
        const userData = {
            name: name,
            email: user.email,
            slug: user.uid, // Using UID as slug for simplicity
            role: 'pembeli',
            createdAt: serverTimestamp(),
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            avatarHint: 'user avatar'
        };
        await setDoc(userRef, userData);
        
        // If the user was created with email/password, update their auth profile display name
        if (fullName && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: fullName });
        }

    } else {
        // Document exists, you might want to update it with the latest login time, etc.
        // For now, we do nothing if it already exists.
    }
}

const auth = getAuth(initializeFirebase().app);

// Sign in with Google and create user document if it's a new user
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    await createUserDocument(user);

    return { success: true, user };
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Provide more specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
          return { success: false, error: 'Proses masuk dibatalkan.' };
      }
      return { success: false, error: 'Gagal masuk dengan Google. Silakan coba lagi.' };
    }
    return { success: false, error: 'Terjadi kesalahan yang tidak diketahui.' };
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, fullName: string) {
    try {
        if (!fullName) {
            return { success: false, error: 'Nama lengkap harus diisi.'};
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        await createUserDocument(user, fullName);

        return { success: true, user };
    } catch (error) {
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' };
            }
            return { success: false, error: 'Gagal mendaftar. Pastikan email valid dan kata sandi lebih dari 6 karakter.' };
        }
        return { success: false, error: 'Terjadi kesalahan yang tidak diketahui.' };
    }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        if (error instanceof FirebaseError) {
             if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                return { success: false, error: 'Email atau kata sandi salah.' };
            }
            return { success: false, error: 'Gagal masuk. Silakan coba lagi.' };
        }
        return { success: false, error: 'Terjadi kesalahan yang tidak diketahui.' };
    }
}


// Sign out
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Gagal keluar. Silakan coba lagi.' };
  }
}
