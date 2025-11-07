'use client';

import Link from 'next/link';
import {
  CircleUserRound,
  Menu,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSidebar } from './ui/sidebar';

const navLinks = [
  { href: '/admin/dashboard', label: 'Ringkasan' },
  { href: '/admin/dashboard/products', label: 'Produk' },
  { href: '/admin/dashboard/upload', label: 'Unggah' },
  { href: '/admin/dashboard/analytics', label: 'Analitik' },
  { href: '/admin/dashboard/settings', label: 'Pengaturan' },
];

export function AdminHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Alihkan Menu</span>
        </Button>

      <div className="flex flex-1 items-center justify-end space-x-2">
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="w-full bg-card md:w-64 pl-10 rounded-md"
            />
          </div>
        </div>
        <nav className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu Pengguna">
                <CircleUserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard/settings">
                  <span>Pengaturan</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <span>Lihat Toko</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Keluar</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
