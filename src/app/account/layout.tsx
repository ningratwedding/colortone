
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
    // Iterate in reverse to match more specific paths first, e.g., /account/affiliate/products before /account/affiliate
    for (const item of [...menuItems].reverse()) {
        if (pathname === item.href || (!item.exact && pathname.startsWith(item.href))) {
            return item.label;
        }
    }
    // Fallback for base /account page
    if (pathname === '/account') return 'Akun Saya';
    return 'Pengaturan Akun';
  };

  const isLinkActive = (itemHref: string, isExact?: boolean) => {
    if (isExact) {
      return pathname === itemHref;
    }
    // Special case for the main dashboard to avoid it being active for sub-pages
    if (itemHref === '/account/affiliate') {
        return pathname === '/account/affiliate';
    }
    return pathname.startsWith(itemHref);
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="w-full">
          <header className="mb-6 hidden md:block">
            <h1 className="text-2xl font-bold font-headline">{getPageTitle()}</h1>
          </header>

          {/* Mobile Navigation */}
          <div className="md:hidden mb-6 border-b">
            <nav className="flex -mb-px overflow-x-auto">
              {menuItems.map(({ href, label, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'py-3 px-4 text-sm font-medium whitespace-nowrap text-muted-foreground border-b-2 border-transparent',
                    isLinkActive(href, exact) && 'text-primary border-primary'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="w-full grid md:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden md:block self-start sticky top-20">
            <nav className="flex flex-col space-y-1">
              <h2 className="text-lg font-bold font-headline mb-2 px-3">Akun Saya</h2>
              {baseMenuItems.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isLinkActive(href, exact) && 'bg-muted text-primary font-semibold'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}

              {userProfile?.role === 'affiliator' && (
                <>
                    <h2 className="text-lg font-bold font-headline mt-4 mb-2 px-3">Afiliasi</h2>
                    {affiliateMenuItems.map(({ href, label, icon: Icon, exact }) => (
                         <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                isLinkActive(href, exact) && 'bg-muted text-primary font-semibold'
                            )}
                            >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    ))}
                </>
              )}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
