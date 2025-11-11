

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
