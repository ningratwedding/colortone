// src/firebase/client-provider.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase, type FirebaseServices } from './index';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * A client-side component that initializes Firebase and provides it to its children.
 * This ensures that Firebase is only initialized once on the client.
 */
export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Initialize Firebase only on the client-side
    if (typeof window !== 'undefined') {
      const firebaseServices = initializeFirebase();
      setServices(firebaseServices);
    }
  }, []);

  // While Firebase is initializing, you can show a loader or null
  if (!services) {
    // You can return a loading spinner here if you want
    return null;
  }

  // Once initialized, provide the services to the rest of the app
  return <FirebaseProvider value={services}>{children}</FirebaseProvider>;
}
