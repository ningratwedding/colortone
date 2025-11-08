// src/components/FirebaseErrorListener.tsx
'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from './errors';

/**
 * A client component that listens for Firestore permission errors
 * and displays a toast notification. This is intended for development
 * purposes to make it easier to debug security rules.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(
        'Firestore Security Rules Error:',
        JSON.stringify(error.context, null, 2)
      );

      // In a real app, you might want to use a more user-friendly
      // error message in production.
      toast({
        variant: 'destructive',
        title: 'Firestore: Permission Denied',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{error.toString()}</code>
          </pre>
        ),
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
