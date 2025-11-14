
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, ShoppingBag, PartyPopper, Star, Palette, LayoutGrid } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';

const baseMenuItems = [
  { href: '/account/purchases', label: 'Pembelian Saya', icon: ShoppingBag },
  { href: '/account/settings', label: 'Pengaturan Akun', icon: Settings },
  { href: '/account/appearance', label: 'Tampilan Profil', icon: Palette },
];

const affiliateMenuItems = [
    { href: '/account/affiliate', label: 'Dasbor Afiliasi', icon: PartyPopper, exact: true },
    { href: '/account/affiliate/products', label: 'Produk Unggulan', icon: Star },
    { href: '/account/affiliate/categories', label: 'Kategori Saya', icon: LayoutGrid }
];


export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userProfileRef = React.useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const menuItems = userProfile?.role === 'affiliator' ? [...baseMenuItems, ...affiliateMenuItems] : baseMenuItems;

  const getPageTitle = () => {
    for (const item of menuItems.slice().reverse()) {
        if (pathname.startsWith(item.href)) {
            return item.label;
        }
    }
    return 'Akun Saya';
  };

  return (
    <>
      <SiteHeader />
      <div className="flex-1 w-full px-4 py-6">
        <div className="w-full">
          <header className="mb-6 hidden md:block">
            <h1 className="text-2xl font-bold font-headline">{getPageTitle()}</h1>
          </header>

          {/* Mobile Navigation */}
          <div className="md:hidden mb-6 border-b">
            <nav className="flex -mb-px overflow-x-auto">
              {menuItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'py-3 px-4 text-sm font-medium whitespace-nowrap text-muted-foreground border-b-2 border-transparent',
                    pathname.startsWith(href) && 'text-primary border-primary'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="w-full grid md:grid-cols-4 gap-8">
          <aside className="hidden md:block md:col-span-1 self-start sticky top-20">
            <nav className="flex flex-col space-y-2">
              <h2 className="text-lg font-bold font-headline mb-2">Akun Saya</h2>
              {menuItems.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    (exact ? pathname === href : pathname.startsWith(href)) ? 'bg-muted text-primary font-semibold' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
