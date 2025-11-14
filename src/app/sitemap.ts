import { MetadataRoute } from 'next';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import { collection, getDocs, query } from 'firebase/firestore';
import type { Product, UserProfile } from '@/lib/data';
import { siteConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { firestore } = initializeServerSideFirebase();

  const baseUrl = siteConfig.url;

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
     {
      url: `${baseUrl}/download`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic product pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsQuery = query(collection(firestore, 'products'));
    const productsSnapshot = await getDocs(productsQuery);
    productRoutes = productsSnapshot.docs.map((doc) => {
      const product = doc.data() as Product;
      return {
        url: `${baseUrl}/product/${doc.id}`,
        lastModified: new Date(), // Ideally, you'd use a 'updatedAt' field from the product
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Dynamic user profile pages
  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const usersQuery = query(collection(firestore, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    userRoutes = usersSnapshot.docs.map((doc) => {
      const user = doc.data() as UserProfile;
      return {
        url: `${baseUrl}/${user.slug}`,
        lastModified: new Date(), // Ideally, you'd use a 'lastUpdatedAt' field
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Error fetching users for sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes, ...userRoutes];
}
