
"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  SlidersHorizontal,
  Search,
  LayoutGrid,
  Bell,
  Laptop,
  Megaphone,
  CreditCard,
  LogOut,
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
import { useUser } from "@/firebase/auth/use-user";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { UserProfile } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";
import { Card } from "@/components/ui/card";
import { signOut } from "@/firebase/auth/actions";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { href: "/admin", label: "Ringkasan", icon: Home, exact: true },
  { href: "/admin/campaigns", label: "Kampanye", icon: Megaphone },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: LayoutGrid },
  { href: "/admin/software", label: "Software", icon: Laptop },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/billing", label: "Penagihan", icon: CreditCard },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart },
];

const settingsItem = { href: "/admin/settings", label: "Pengaturan Aplikasi", icon: Settings };

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = React.useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const allMenuItems = [...menuItems, settingsItem];
  
  const getPageTitle = () => {
    for (const item of [...allMenuItems].reverse()) {
      if (item.exact) {
        if (pathname === item.href) return item.label;
      } else {
        if (pathname.startsWith(item.href)) return item.label;
      }
    }
    return "Dasbor Admin";
  };
  const pageTitle = getPageTitle();

  const getInitials = (name?: string | null) => {
    if (!name) return 'A';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Berhasil Keluar', description: 'Anda telah keluar dari akun Anda.' });
    router.push('/');
    router.refresh();
  };

  const loading = userLoading || (user && profileLoading);

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" variant="sidebar" side="left" className="rounded-r-2xl">
          <SidebarHeader>
             <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 text-sidebar-foreground">
                  <Logo />
                  <span className="font-bold group-data-[collapsible=icon]:hidden">
                    {siteConfig.name}
                  </span>
                </Link>
             </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarSeparator className="my-2" />
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon, exact }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={exact ? pathname === href : pathname.startsWith(href)}
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
                 <SidebarSeparator />
                <div className="p-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button
                                variant="ghost"
                                className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0 hover:bg-white/10"
                            >
                                {loading ? (
                                <Skeleton className="h-8 w-8 rounded-full" />
                                ) : (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name || 'Admin Avatar'} />
                                    <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                                </Avatar>
                                )}
                                 <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                                    <p className="text-sm font-medium leading-none">{userProfile?.name || 'Admin'}</p>
                                    <p className="text-xs text-sidebar-foreground/70">{userProfile?.role}</p>
                                 </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mb-2">
                            <DropdownMenuLabel>{userProfile?.name || 'Admin'}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings">Pengaturan</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/">Lihat Situs</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground px-2 sm:px-6">
             <SidebarTrigger className="flex text-primary-foreground hover:bg-white/10" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold hidden md:block">{pageTitle}</h1>
            </div>
             <div className="flex items-center gap-2">
                <div className="relative flex-initial md:grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari..."
                        className="w-full rounded-lg bg-background/80 text-foreground pl-8 h-9"
                    />
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-2 md:p-4">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
