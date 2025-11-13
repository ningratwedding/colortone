
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
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
async function createUserDocument(user: User, profileName?: string): Promise<UserProfile> {
    const db = getDb();
    const auth = getAuth(initializeFirebase().app);

    const existingProfile = await getUserProfile(user.uid);
    if (existingProfile) {
        return existingProfile;
    }

    const name = profileName || user.displayName || 'Pengguna Baru';
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Check if slug already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('slug', '==', slug), limit(1));
    const slugSnapshot = await getDocs(q);
    if (!slugSnapshot.empty) {
        // Instead of appending a UID, we now throw an error to be caught by the UI.
        throw new Error(`Nama pengguna "${name}" sudah digunakan. Silakan gunakan nama lain.`);
    }

    const defaultAvatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newUserProfile: Omit<UserProfile, 'id' | 'createdAt'> & { createdAt: any } = {
        name: name,
        email: user.email!,
        slug: slug, 
        role: 'pembeli',
        createdAt: serverTimestamp(),
        avatarUrl: user.photoURL || randomAvatar.imageUrl,
        avatarHint: user.photoURL ? 'user avatar' : randomAvatar.imageHint,
    };
    await setDoc(doc(db, 'users', user.uid), newUserProfile);
    
    if (profileName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: profileName, photoURL: newUserProfile.avatarUrl });
    } else if (auth.currentUser && !auth.currentUser.photoURL) {
         await updateProfile(auth.currentUser, { photoURL: newUserProfile.avatarUrl });
    }

    // This is problematic as serverTimestamp() returns a sentinel value, not a Date.
    // We fetch the doc again to get the actual timestamp if needed, or just cast it for now.
    const createdProfile = await getUserProfile(user.uid);
    if (!createdProfile) {
        throw new Error("Failed to retrieve created user profile.");
    }
    return createdProfile;
}

// Sign in with Google and create user document if it's a new user
export async function signInWithGoogle() {
  const auth = getAuth(initializeFirebase().app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // After sign-in, the getOrCreateUserProfile handles document creation
    // It's handled in the page component to provide better UI feedback.
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
export async function signUpWithEmail(email: string, password: string, profileName: string) {
    const auth = getAuth(initializeFirebase().app);
    try {
        if (!profileName) {
            return { success: false, error: 'Nama profil harus diisi.'};
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        await sendEmailVerification(user);

        // Now, we create the document, which includes the slug uniqueness check
        const profile = await createUserDocument(user, profileName);

        return { success: true, user, profile };
    } catch (error) {
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' };
            }
            return { success: false, error: 'Gagal mendaftar. Pastikan email valid dan kata sandi lebih dari 6 karakter.' };
        }
        // Catch the custom error from createUserDocument
        if (error instanceof Error) {
            return { success: false, error: error.message };
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
            // This case might happen if a user was created in Auth but not in Firestore.
            // We could attempt to create it here, but for now, we'll treat it as an error.
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

// Send password reset email
export async function sendPasswordReset(email: string) {
  const auth = getAuth(initializeFirebase().app);
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        return { success: false, error: 'Email tidak ditemukan atau tidak valid.' };
      }
      return { success: false, error: 'Gagal mengirim email pemulihan. Coba lagi nanti.' };
    }
    return { success: false, error: 'Terjadi kesalahan yang tidak diketahui.' };
  }
}
