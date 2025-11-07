"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Home,
  Package,
  PanelLeft,
  Settings,
  Upload,
  UserCircle,
  Search,
  CircleUserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { href: "/admin/dashboard", label: "Ringkasan", icon: Home },
  { href: "/admin/dashboard/products", label: "Produk", icon: Package },
  { href: "/admin/dashboard/upload", label: "Unggah", icon: Upload },
  { href: "/admin/dashboard/analytics", label: "Analitik", icon: BarChart },
  { href: "/admin/dashboard/settings", label: "Pengaturan", icon: Settings },
];

function AdminHeader() {
    const { setOpenMobile } = useSidebar();
    return (
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Alihkan Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>
                            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpenMobile(false)}>
                                <UserCircle className="h-6 w-6"/>
                                <span>Dasbor Kreator</span>
                            </Link>
                        </SheetTitle>
                        <SheetDescription className="sr-only">Navigasi dasbor</SheetDescription>
                    </SheetHeader>
                    <nav className="grid gap-2 text-lg font-medium p-4">
                        {menuItems.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                onClick={() => setOpenMobile(false)}
                            >
                                <Icon className="h-5 w-5" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Cari..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <CircleUserRound/>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                <DropdownMenuItem>Dukungan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Keluar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar className="hidden border-r bg-background sm:block">
          <SidebarHeader className="p-4 py-5">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <UserCircle className="h-6 w-6"/>
                <span>Dasbor Kreator</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
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

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <AdminHeader/>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
