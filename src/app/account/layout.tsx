

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  ShoppingBag,
  PartyPopper,
  Star,
  Palette,
  LayoutDashboard,
  Loader2,
  Search,
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
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

const baseMenuItems = [
  { href: '/account/purchases', label: 'Pembelian Saya', icon: ShoppingBag },
  { href: '/account/settings', label: 'Pengaturan Akun', icon: Settings },
  { href: '/account/appearance', label: 'Tampilan Profil', icon: Palette },
];

const creatorMenuItems = [
  { href: '/creator/dashboard', label: 'Dasbor Kreator', icon: LayoutDashboard },
];

const affiliateMenuItems = [
  { href: '/account/affiliate', label: 'Dasbor Afiliasi', icon: PartyPopper, exact: true },
  { href: '/account/affiliate/products', label: 'Atur Produk Unggulan', icon: Star },
];

export default function AccountLayout({
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

  let menuItems = [...baseMenuItems];
  if (userProfile?.role === 'kreator') {
    menuItems.push(...creatorMenuItems);
  }
  if (userProfile?.role === 'affiliator') {
    menuItems.push(...affiliateMenuItems);
  }

  const isLinkActive = (itemHref: string, isExact?: boolean) => {
    if (isExact) return pathname === itemHref;
    if (itemHref === '/account/affiliate') return pathname === '/account/affiliate';
    return pathname.startsWith(itemHref);
  };
  
  const getPageTitle = () => {
    for (const item of [...menuItems].reverse()) {
        if (pathname === item.href || (!item.exact && pathname.startsWith(item.href))) {
            return item.label;
        }
    }
    if (pathname === '/account') return 'Akun Saya';
    return 'Pengaturan Akun';
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
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
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
            <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              Akun Saya
            </h2>
            {baseMenuItems.map(({ href, label, icon: Icon, exact }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isLinkActive(href, exact)} tooltip={label}>
                  <Link href={href}>
                    <Icon />
                    <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {userProfile?.role === 'kreator' && (
              <>
                <SidebarSeparator className="my-2" />
                <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Kreator
                </h2>
                {creatorMenuItems.map(({ href, label, icon: Icon, exact }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isLinkActive(href, exact)} tooltip={label}>
                      <Link href={href}>
                        <Icon />
                        <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
            {userProfile?.role === 'affiliator' && (
               <>
                <SidebarSeparator className="my-2" />
                <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Afiliasi
                </h2>
                {affiliateMenuItems.map(({ href, label, icon: Icon, exact }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isLinkActive(href, exact)} tooltip={label}>
                      <Link href={href}>
                        <Icon />
                        <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {profileLoading ? null : (
            userProfile?.plan === 'free' && (
              <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:-mx-1">
                <Card className="group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0">
                  <CardHeader className="p-2 group-data-[collapsible=icon]:hidden">
                    <CardTitle className="text-sm">Upgrade ke Pro</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={handleRequestPro}
                      disabled={isRequestingPro}
                    >
                      <span className="group-data-[collapsible=icon]:hidden">
                        {isRequestingPro ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>...</> : "Dapatkan Fitur Pro"}
                      </span>
                      <Star className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-2 sm:px-6">
          <SidebarTrigger className="flex" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold hidden md:block">{getPageTitle()}</h1>
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
                    <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name || 'User Avatar'} />
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
