
import type { Timestamp } from 'firebase/firestore';

export type AffiliateProductCategory = {
  id: string;
  name: string;
  productIds: string[];
};

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
  headerImageUrl?: string | null;
  headerImageHint?: string;
  headerColor?: string;
  showHeaderGradient?: boolean;
  profileBackgroundColor?: string;
  profileBackgroundImageUrl?: string | null;
  profileBackgroundImageHint?: string;
  profileTitleFont?: string;
  profileTitleFontColor?: string;
  profileBodyFont?: string;
  profileBodyFontColor?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
    whatsapp?: string;
    linkedin?: string;
  };
  socialsSettings?: {
    style: 'iconOnly' | 'pill';
    layout?: 'horizontal' | 'vertical';
    backgroundColor?: string;
    backgroundOpacity?: number;
    borderRadius?: number;
    fontColor?: string;
    pillSize?: 'sm' | 'md' | 'lg';
    pillWidth?: number;
  };
  productCardSettings?: {
    style?: 'simple' | 'standard';
    textAlign?: 'left' | 'center';
    imageAspectRatio?: '3/2' | '4/3' | '1/1';
    buttonStyle?: 'fill' | 'outline';
  };
  categorySettings?: {
    style?: 'default' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    shape?: 'default' | 'pill';
  };
  role: 'pembeli' | 'kreator' | 'admin' | 'affiliator';
  featuredProductIds?: string[];
  affiliateProductCategories?: AffiliateProductCategory[];
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
