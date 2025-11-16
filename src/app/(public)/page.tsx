
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is a temporary redirect to the new home page.
// The content has been moved to /app/home/page.tsx
export default function RedirectToHome() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/home');
    }, [router]);
    
    return null;
}
