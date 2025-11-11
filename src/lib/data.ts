

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
  thumbnailUrl: string;
  thumbnailHint: string;
  imageBeforeUrl?: string;
  imageBeforeHint?: string;
  imageAfterUrl?: string;
  imageAfterHint?: string;
  category: string;
  compatibleSoftware: string[];
  tags: string[];
  sales: number;
  downloadUrl: string;
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
