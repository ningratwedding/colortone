
'use client';

import Link from 'next/link';
import {
  CircleUserRound,
  Menu,
  Search,
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

export function AdminHeader({ title }: { title: string }) {
  return (
    <>
      <div className="flex-1">
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
      </div>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="flex-1 md:flex-initial md:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-full bg-card pl-10 rounded-full"
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
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <span>Pengaturan Platform</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <span>Lihat Situs</span>
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
    </>
  );
}
