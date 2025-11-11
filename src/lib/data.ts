

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
  createdAt: Timestamp | { seconds: number, nanoseconds: number };
};

export type Product = {
  id: string;
  name: string;
  creatorId: string; 
  price: number;
  description: string;
  imageBeforeUrl: string;
  imageBeforeHint: string;
  imageAfterUrl: string;
  imageAfterHint: string;
  category: string;
  compatibleSoftware: string[];
  tags: string[];
  sales: number;
};

export type Order = {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    creatorId: string;
    purchaseDate: { seconds: number, nanoseconds: number }; // Firestore Timestamp
    amount: number;
    status: 'Selesai' | 'Diproses' | 'Dibatalkan';
}

export const software = [
    { id: 'lightroom', name: 'Lightroom' },
    { id: 'lightroom-mobile', name: 'Lightroom Mobile'},
    { id: 'photoshop', name: 'Photoshop' },
    { id: 'capture-one', name: 'Capture One' },
    { id: 'premiere-pro', name: 'Premiere Pro' },
    { id: 'final-cut', name: 'Final Cut Pro' },
    { id: 'davinci-resolve', name: 'DaVinci Resolve' },
    { id: 'capcut', name: 'CapCut' },
    { id: 'vn-editor', name: 'VN Video Editor' },
];
