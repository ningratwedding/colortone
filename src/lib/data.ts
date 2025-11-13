

import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  slug: string;
  name: string; // This is the public profile name
  fullName?: string; // This is the user's full legal name
  email: string;
  phoneNumber?: string;
  avatarUrl: string;
  avatarHint: string;
  bio?: string;
  headerImageUrl?: string;
  headerImageHint?: string;
  headerColor?: string;
  showHeaderGradient?: boolean;
  profileBackgroundColor?: string;
  profileBackgroundImageUrl?: string;
  profileBackgroundImageHint?: string;
  profileTitleFontColor?: string;
  profileBodyFontColor?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  socialsSettings?: {
    style: 'iconOnly' | 'pill';
    layout?: 'horizontal' | 'vertical';
    backgroundColor?: string;
    backgroundOpacity?: number;
    borderRadius?: number;
    fontColor?: string;
  };
  role: 'pembeli' | 'kreator' | 'admin' | 'affiliator';
  featuredProductIds?: string[];
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
  stock?: number | null;
  weight?: number | null; // in grams
  dimensions?: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  reviewsCount?: number;
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
  type: 'digital' | 'fisik' | 'semua';
};

export type Software = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};

export type Campaign = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageHint: string;
  linkUrl: string;
  isActive: boolean;
  createdAt?: { seconds: number; nanoseconds: number; };
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

export type ImagePlaceholder = {
    imageUrl: string;
    imageHint: string;
    description: string;
}
