// src/firebase/provider.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

// Define the shape of the context value
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
}

// Create the context with a default value
const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

// Define the props for the provider component
interface FirebaseProviderProps {
  children: ReactNode;
  value: FirebaseContextValue;
}

/**
 * Provides the Firebase app, auth, and firestore instances to its children.
 */
export function FirebaseProvider({ children, value }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

// Custom hooks to easily access the context values

export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { app } = useFirebase();
  if (!app) {
    throw new Error('Firebase App has not been initialized.');
  }
  return app;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) {
    throw new Error(
      'Firebase Auth has not been initialized or is not available.'
    );
  }
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) {
    throw new Error(
      'Firebase Firestore has not been initialized or is not available.'
    );
  }
  return firestore;
};

export const useStorage = (): FirebaseStorage => {
    const { storage } = useFirebase();
    if (!storage) {
        throw new Error(
        'Firebase Storage has not been initialized or is not available.'
        );
    }
    return storage;
}
