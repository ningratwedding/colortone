'use client';

import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type Query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function useCollection<T>(query: Query | null | undefined) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  const memoizedQuery = useMemo(() => query, [query]);

  useEffect(() => {
    if (!memoizedQuery || !firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        setLoading(false);
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(result);
        setError(null);
      },
      async (err) => {
        setLoading(false);
        setError(err);
        setData(null);

        const permissionError = new FirestorePermissionError({
          path: (memoizedQuery as any)._query.path.segments.join('/'),
          operation: 'list',
        } satisfies SecurityRuleContext);
        
        errorEmitter.emit('permission-error', permissionError);
        console.error(`Error fetching collection:`, err);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, firestore]);

  return { data, loading, error };
}
