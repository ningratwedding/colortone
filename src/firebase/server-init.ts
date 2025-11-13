// src/firebase/server-init.ts
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Type definition for the initialized Firebase services
export interface ServerFirebaseServices {
  app: FirebaseApp;
  firestore: Firestore;
}

// Singleton pattern to ensure Firebase is initialized only once per server instance
let serverFirebaseServices: ServerFirebaseServices | null = null;

/**
 * Initializes Firebase for server-side usage and returns the core services.
 * It ensures that Firebase is only initialized once.
 * This function does NOT contain a 'use client' directive.
 */
export function initializeServerSideFirebase(): ServerFirebaseServices {
  if (serverFirebaseServices) {
    return serverFirebaseServices;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);

  serverFirebaseServices = { app, firestore };

  return serverFirebaseServices;
}
