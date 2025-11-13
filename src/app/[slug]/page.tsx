import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { ProfileContent } from './profile-client';
import { doc, getDoc, query, collection, where, getDocs, limit } from 'firebase/firestore';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import type { UserProfile } from '@/lib/data';

type Props = {
  params: { slug: string }
}

// This function generates metadata on the server.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { firestore } = initializeServerSideFirebase();
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('slug', '==', params.slug), limit(1));
    
    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data() as UserProfile;
            const displayName = user.fullName || user.name;
            const description = user.bio || `Lihat profil dan produk dari ${displayName} di ${siteConfig.name}.`;

            return {
                title: displayName,
                description: description,
                openGraph: {
                    title: `${displayName} | ${siteConfig.name}`,
                    description: description,
                    url: `${siteConfig.url}/${user.slug}`,
                    images: user.avatarUrl ? [{ url: user.avatarUrl }] : [siteConfig.ogImage],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: `${displayName} | ${siteConfig.name}`,
                    description: description,
                    images: user.avatarUrl ? [user.avatarUrl] : [siteConfig.ogImage],
                },
            };
        }
    } catch (error) {
        console.error("Error fetching user for metadata:", error);
    }

    // Fallback metadata if user not found
    return {
        title: "Profil Tidak Ditemukan",
        description: `Pengguna yang Anda cari tidak dapat ditemukan di ${siteConfig.name}.`,
    };
}


export default function ProfileRootPage({ params }: { params: { slug: string } }) {
    
    return (
        <>
            <ProfileContent slug={params.slug} />
            <SiteFooter />
        </>
    )
}
