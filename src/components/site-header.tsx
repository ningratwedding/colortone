"use client";

import Link from "next/link";
import {
  CircleUserRound,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Preset" },
  { href: "#", label: "LUT" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-4">
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                aria-label="Alihkan Menu"
                >
                <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-8 w-8 text-primary" />
                            <span className="font-bold text-xl font-headline">FilterForge</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 pt-6">
                {navLinks.map(({ href, label }) => (
                    <Link
                    key={href}
                    href={href}
                    className="text-lg font-medium transition-colors hover:text-primary text-foreground"
                    >
                    {label}
                    </Link>
                ))}
                </nav>
            </SheetContent>
            </Sheet>
        </div>

        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              FilterForge
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari preset..."
                className="w-full bg-card md:w-64 pl-10 rounded-full"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <Link href="/admin/dashboard">Menjadi Penjual</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Keranjang Belanja">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu Pengguna">
                  <CircleUserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <span>Dasbor</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login">Masuk</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
