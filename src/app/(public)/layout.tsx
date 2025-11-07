'use client';

import { SiteHeader } from '@/components/site-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow">{children}</main>
    </>
  );
}
