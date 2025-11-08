
// src/firebase/index.ts
'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// Re-export the provider hooks
export * from './provider';

// Re-export the new hooks
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';

// Type definition for the initialized Firebase services
export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

// Singleton pattern to ensure Firebase is initialized only once
let firebaseServices: FirebaseServices | null = null;

/**
 * Initializes Firebase and returns the core services.
 * It ensures that Firebase is only initialized once.
 */
export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  firebaseServices = { app, auth, firestore, storage };

  return firebaseServices;
}
