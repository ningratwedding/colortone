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
  Upload,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-header";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SlidersHorizontal } from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Ringkasan", icon: Home },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/upload", label: "Unggah", icon: Upload },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    
    const pageTitle = menuItems.find(item => item.href === pathname)?.label || "Dasbor";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar className="hidden border-r bg-background md:block">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center space-x-2">
                <SlidersHorizontal className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold font-headline">FilterForge</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || (pathname.startsWith(href) && href !== '/admin')}
                    className="justify-start"
                  >
                    <Link href={href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col md:pl-[16rem]">
          <AdminHeader title={pageTitle} />
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
