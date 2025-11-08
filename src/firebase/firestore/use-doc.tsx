'use client';

import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function useDoc<T>(docRef: DocumentReference | null | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  const memoizedRef = useMemo(() => docRef, [docRef]);

  useEffect(() => {
    if (!memoizedRef || !firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id } as T);
        } else {
          setData(null);
        }
        setError(null);
      },
      async (err) => {
        setLoading(false);
        setError(err);
        setData(null);
        
        const permissionError = new FirestorePermissionError({
          path: memoizedRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);
        console.error(`Error fetching document from ${memoizedRef.path}:`, err);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef, firestore]);

  return { data, loading, error };
}
