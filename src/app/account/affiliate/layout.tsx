
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = React.useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace(`/login?redirect=/account/affiliate`);
    } else if (!profileLoading && userProfile && userProfile.role !== 'affiliator') {
      toast({
        variant: "destructive",
        title: "Akses Ditolak",
        description: "Anda harus menjadi afiliator untuk mengakses dasbor ini.",
      });
      router.replace('/account');
    }
  }, [user, userLoading, userProfile, profileLoading, router, toast]);

  const loading = userLoading || profileLoading;

  if (loading || (user && userProfile?.role !== 'affiliator')) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
