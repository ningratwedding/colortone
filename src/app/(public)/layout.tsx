'use client';

import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <SiteHeader />}
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </>
  );
}
