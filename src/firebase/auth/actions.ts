
'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/data';

// Helper to get firestore instance
const getDb = () => getFirestore(initializeFirebase().app);

// Helper function to get a user profile from Firestore
async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const db = getDb();
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
}


// Helper function to create a user document in Firestore
async function createUserDocument(user: User, fullName?: string): Promise<UserProfile> {
    const db = getDb();
    const auth = getAuth(initializeFirebase().app);

    const existingProfile = await getUserProfile(user.uid);
    if (existingProfile) {
        return existingProfile;
    }

    const name = fullName || user.displayName || 'Pengguna Baru';
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const newUserProfile: Omit<UserProfile, 'id' | 'createdAt'> & { createdAt: any } = {
        name: name,
        email: user.email!,
        slug: `${slug}-${user.uid.substring(0, 5)}`, 
        role: 'pembeli',
        createdAt: serverTimestamp(),
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        avatarHint: 'user avatar'
    };
    await setDoc(doc(db, 'users', user.uid), newUserProfile);
    
    if (fullName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
    }

    return { id: user.uid, ...newUserProfile, createdAt: new Date() } as unknown as UserProfile;
}

// Sign in with Google and create user document if it's a new user
export async function signInWithGoogle() {
  const auth = getAuth(initializeFirebase().app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof FirebaseError) {
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
    const auth = getAuth(initializeFirebase().app);
    try {
        if (!fullName) {
            return { success: false, error: 'Nama lengkap harus diisi.'};
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Send verification email
        await sendEmailVerification(user);

        const profile = await createUserDocument(user, fullName);

        return { success: true, user, profile };
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
    const auth = getAuth(initializeFirebase().app);
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const profile = await getUserProfile(result.user.uid);
        if (!profile) {
            return { success: false, error: 'Profil pengguna tidak ditemukan.'}
        }
        return { success: true, user: result.user, profile };
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
  const auth = getAuth(initializeFirebase().app);
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
