
import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { ProfileContent } from './profile-client';
import { doc, getDoc, query, collection, where, getDocs, limit, documentId } from 'firebase/firestore';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import type { UserProfile } from '@/lib/data';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string }
}

async function getUserProfile(slug: string): Promise<UserProfile | null> {
    const { firestore } = initializeServerSideFirebase();
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('slug', '==', slug), limit(1));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as UserProfile;
}

// This function generates metadata on the server.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const profileUser = await getUserProfile(params.slug);
    
    if (profileUser) {
        const displayName = profileUser.fullName || profileUser.name;
        const description = profileUser.bio || `Lihat profil dan produk dari ${displayName} di ${siteConfig.name}.`;

        return {
            title: displayName,
            description: description,
            openGraph: {
                title: `${displayName} | ${siteConfig.name}`,
                description: description,
                url: `${siteConfig.url}/${profileUser.slug}`,
                images: profileUser.avatarUrl ? [{ url: profileUser.avatarUrl }] : [siteConfig.ogImage],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${displayName} | ${siteConfig.name}`,
                description: description,
                images: profileUser.avatarUrl ? [profileUser.avatarUrl] : [siteConfig.ogImage],
            },
            ...(profileUser.profileBackgroundColor && {
                themeColor: profileUser.profileBackgroundColor
            })
        };
    }

    // Fallback metadata if user not found
    return {
        title: "Profil Tidak Ditemukan",
        description: `Pengguna yang Anda cari tidak dapat ditemukan di ${siteConfig.name}.`,
    };
}


export default async function ProfileRootPage({ params }: { params: { slug: string } }) {
    const profileUser = await getUserProfile(params.slug);

    if (!profileUser) {
        notFound();
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Products are now fetched client-side in ProfileContent */}
                <ProfileContent profileUser={profileUser} />
            </main>
            <SiteFooter />
        </div>
    )
}
