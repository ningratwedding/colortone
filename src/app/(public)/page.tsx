
'use client';

import { useRouter } from 'next/navigation';

// This is a temporary redirect to the new home page.
// The content has been moved to /app/home/page.tsx
export default function RedirectToHome() {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.replace('/home');
    }
    return null;
}
