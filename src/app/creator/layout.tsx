

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Settings,
  ShoppingCart,
  Search,
  Loader2,
  Star
} from 'lucide-react';
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
  SidebarSeparator
} from "@/components/ui/sidebar";
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
import { useUser } from "@/firebase/auth/use-user";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { UserProfile } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const menuItems = [
  { href: '/creator/dashboard', label: 'Ringkasan', icon: Home },
  { href: '/creator/products', label: 'Produk', icon: Package },
  { href: '/creator/orders', label: 'Pesanan', icon: ShoppingCart },
];

const settingsItem = { href: '/creator/settings', label: 'Pengaturan', icon: Settings };

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isRequestingPro, setIsRequestingPro] = React.useState(false);

  const userProfileRef = React.useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const allMenuItems = [...menuItems, settingsItem];
  const pageTitle = allMenuItems.find((item) => pathname.startsWith(item.href) && (item.href !== '/creator/dashboard' || pathname === '/creator/dashboard'))?.label || "Dasbor Kreator";
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'K';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const handleRequestPro = () => {
    setIsRequestingPro(true);
    setTimeout(() => {
        toast({
            title: "Permintaan Terkirim!",
            description: "Tim kami akan segera menghubungi Anda melalui email untuk proses selanjutnya. Terima kasih!",
            duration: 8000,
        });
        setIsRequestingPro(false);
    }, 1000);
  };

  const loading = userLoading || (user && profileLoading);

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset" side="left">
          <SidebarHeader>
            <Link href="/" className="flex items-center space-x-2 px-2">
              <Logo />
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || (href !== '/creator/dashboard' && pathname.startsWith(href))}
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
              {profileLoading ? null : (
                  userProfile?.plan === 'free' && (
                    <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:-mx-1">
                        <Card className="group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0 overflow-hidden bg-gradient-to-br from-primary to-blue-500 text-primary-foreground">
                        <CardContent className="p-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                            <div className="mb-2 group-data-[collapsible=icon]:hidden">
                                <h3 className="text-sm font-semibold">Upgrade ke Pro</h3>
                                <p className="text-xs text-primary-foreground/80">Akses semua fitur premium.</p>
                            </div>
                            <Button
                            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-primary-foreground group-data-[collapsible=icon]:border group-data-[collapsible=icon]:border-primary-foreground/50 group-data-[collapsible=icon]:hover:bg-primary-foreground/20"
                            size="sm"
                            onClick={handleRequestPro}
                            disabled={isRequestingPro}
                            >
                            <span className="group-data-[collapsible=icon]:hidden">
                                {isRequestingPro ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Meminta...</> : "Dapatkan Fitur Pro"}
                            </span>
                            <Star className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
                            </Button>
                        </CardContent>
                        </Card>
                    </div>
                  )
              )}
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
            <div className="relative ml-auto flex-initial md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari..."
                className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                   {loading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name || 'Creator Avatar'} />
                      <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userProfile?.name || 'Akun Saya'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/creator/settings">Pengaturan</Link>
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
