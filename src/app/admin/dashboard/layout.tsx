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

const menuItems = [
  { href: "/admin/dashboard", label: "Ringkasan", icon: Home },
  { href: "/admin/dashboard/products", label: "Produk", icon: Package },
  { href: "/admin/dashboard/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/dashboard/upload", label: "Unggah", icon: Upload },
  { href: "/admin/dashboard/analytics", label: "Analitik", icon: BarChart },
  { href: "/admin/dashboard/settings", label: "Pengaturan", icon: Settings },
];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar className="hidden border-r bg-background md:block">
          <SidebarHeader className="p-4 py-5">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <span className="text-lg">Dasbor Kreator</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(href) && (href !== '/admin/dashboard' || pathname === href)}
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
          <AdminHeader/>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
