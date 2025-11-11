

import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  slug: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl: string;
  avatarHint: string;
  bio?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  role: 'pembeli' | 'kreator' | 'admin';
  isAffiliate?: boolean;
  createdAt: Timestamp | { seconds: number, nanoseconds: number };
  bankName?: string;
  bankCode?: string;
  accountHolderName?: string;
  accountNumber?: string;
};

export type Product = {
  id: string;
  name: string;
  creatorId: string; 
  price: number;
  description: string;
  type: 'digital' | 'fisik';
  galleryImageUrls: string[];
  galleryImageHints: string[];
  imageBeforeUrl?: string;
  imageBeforeHint?: string;
  imageAfterUrl?: string;
  imageAfterHint?: string;
  category: string;
  compatibleSoftware?: string[];
  tags: string[];
  sales: number;
  downloadUrl?: string;
  stock?: number;
  weight?: number; // in grams
  dimensions?: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  reviewsCount: number;
  imageAfter: { imageUrl: string; imageHint: string; };

};

export type Order = {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    creatorId: string;
    affiliateId?: string;
    purchaseDate: { seconds: number, nanoseconds: number }; // Firestore Timestamp
    amount: number;
    status: 'Selesai' | 'Diproses' | 'Dibatalkan' | 'Menunggu Pembayaran';
}

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Software = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};

export type PlatformSettings = {
    appName: string;
    supportEmail: string;
    affiliateCommissionRate?: number;
    notifications: {
        newCreator: boolean;
        newProduct: boolean;
    }
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Cinematic Film Presets',
        creatorId: '1',
        price: 150000,
        description: 'A collection of professional presets for a cinematic look.',
        type: 'digital',
        galleryImageUrls: [],
        galleryImageHints: [],
        category: 'presets',
        compatibleSoftware: ['lightroom', 'photoshop'],
        tags: ['cinematic', 'film', 'presets'],
        sales: 120,
        reviewsCount: 25,
        imageAfter: { imageUrl: '/placeholder.svg', imageHint: 'after' },
    }
];
export const categories: Category[] = [
    { id: 'presets', name: 'Presets', slug: 'presets' },
    { id: 'luts', name: 'LUTs', slug: 'luts' },
];
export const software: Software[] = [
    { id: 'lightroom', name: 'Lightroom', slug: 'lightroom' },
    { id: 'photoshop', name: 'Photoshop', slug: 'photoshop' },
    { id: 'davinci', name: 'DaVinci Resolve', slug: 'davinci' },
];
