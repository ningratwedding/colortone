

"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  SlidersHorizontal,
  Search,
  CircleUserRound,
  LayoutGrid,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const menuItems = [
  { href: "/admin", label: "Ringkasan", icon: Home },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: LayoutGrid },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart },
];

const settingsItem = { href: "/admin/settings", label: "Pengaturan", icon: Settings };

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const allMenuItems = [...menuItems, settingsItem];
  const pageTitle =
    allMenuItems.find((item) => pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin'))?.label || "Dasbor Admin";

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset" side="left">
          <SidebarHeader>
            <Link href="/" className="flex items-center space-x-2 px-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span className="text-base font-bold font-headline group-data-[collapsible=icon]:hidden">
                Colortone
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || (href !== "/admin" && pathname.startsWith(href))}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
              <SidebarSeparator />
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(settingsItem.href)}
                            tooltip={settingsItem.label}
                        >
                            <Link href={settingsItem.href}>
                                <Settings />
                                <span className="group-data-[collapsible=icon]:hidden">{settingsItem.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
             <SidebarTrigger className="flex" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold hidden md:block">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative flex-initial md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifikasi</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <CircleUserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Pengaturan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/">Lihat Situs</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Keluar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
