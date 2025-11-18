import { SiteFooter } from '@/components/site-footer';
import * as React from 'react';
import { ProfileContent } from './profile-client';
import { doc, getDoc, query, collection, where, getDocs, limit, documentId } from 'firebase/firestore';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import type { Product, UserProfile } from '@/lib/data';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string }
}

async function getUserAndProducts(slug: string) {
    const { firestore } = initializeServerSideFirebase();
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('slug', '==', slug), limit(1));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { profileUser: null, products: [] };
    }

    const profileUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as UserProfile;
    
    let products: Product[] = [];
    if (profileUser.role === 'seller' && profileUser.id) {
        const productsQuery = query(collection(firestore, "products"), where('creatorId', '==', profileUser.id));
        const productsSnapshot = await getDocs(productsQuery);
        products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } else if (profileUser.role === 'affiliator' && profileUser.featuredProductIds && profileUser.featuredProductIds.length > 0) {
        const productsQuery = query(collection(firestore, "products"), where(documentId(), 'in', profileUser.featuredProductIds.slice(0, 30)));
        const productsSnapshot = await getDocs(productsQuery);
        products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }

    return { profileUser, products };
}

// This function generates metadata on the server.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { profileUser } = await getUserAndProducts(params.slug);
    
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
    const { profileUser, products } = await getUserAndProducts(params.slug);

    if (!profileUser) {
        notFound();
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <ProfileContent profileUser={profileUser} products={products} />
            </main>
            <SiteFooter />
        </div>
    )
}
