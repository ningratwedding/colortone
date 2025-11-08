
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Settings,
  CircleUserRound,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { SiteFooter } from '@/components/site-footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

const menuItems = [
  { href: '/account/purchases', label: 'Pembelian Saya', icon: ShoppingBag },
  { href: '/account/settings', label: 'Pengaturan Akun', icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">FilterForge</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <CircleUserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/purchases">Pembelian</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/settings">Pengaturan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-8">
          <aside className="hidden md:block md:col-span-1">
            <nav className="flex flex-col space-y-2">
              <h2 className="text-lg font-bold font-headline mb-2">Akun Saya</h2>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathname === href ? 'bg-muted text-primary font-semibold' : ''
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
