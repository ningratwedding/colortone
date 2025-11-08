'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Upload,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin-header';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const menuItems = [
  { href: '/creator/dashboard', label: 'Ringkasan', icon: Home },
  { href: '/creator/products', label: 'Produk', icon: Package },
  { href: '/creator/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/creator/upload', label: 'Unggah', icon: Upload },
  { href: '/creator/analytics', label: 'Analitik', icon: BarChart },
  { href: '/creator/settings', label: 'Pengaturan', icon: Settings },
];

function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Alihkan Menu Navigasi</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/creator/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Package className="h-6 w-6" />
              <span>Dasbor Kreator</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="grid gap-2 text-lg font-medium pt-4">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                pathname === href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pageTitle =
    menuItems.find((item) => pathname.startsWith(item.href))?.label || 'Dasbor';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <MobileNav />
        <AdminHeader title={pageTitle} />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
