
'use client';

import Link from 'next/link';
import {
  Menu,
  Search,
  Settings,
  Shield,
  LogOut,
  LogIn,
  LayoutDashboard,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Logo } from './logo';
import { Separator } from './ui/separator';

const navLinks: { href: string; label: string }[] = [];

export function SiteHeader() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const loading = userLoading || (user && profileLoading);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Berhasil Keluar', description: 'Anda telah keluar dari akun Anda.' });
    router.push('/');
    router.refresh(); // To update server-side rendered components
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const UserMenu = () => {
    if (loading) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menu Pengguna" className="hover:bg-primary-foreground/10 data-[state=open]:bg-primary-foreground/10">
            {user ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                <AvatarFallback>{getInitials(userProfile?.name || user.displayName)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user ? userProfile?.name || user.email : 'Akun Saya'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user && userProfile ? (
            <>
              <DropdownMenuGroup>
                {userProfile.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Dasbor Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {userProfile.role === 'kreator' && (
                  <DropdownMenuItem asChild>
                    <Link href="/creator/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dasbor Kreator</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                 <DropdownMenuItem asChild>
                    <Link href="/account/purchases">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Pembelian Saya</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan Akun</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Left Section (Logo and Mobile Menu) */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-primary-foreground/10 data-[state=open]:bg-primary-foreground/10" aria-label="Alihkan Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2">
                    <Logo className="h-6 w-6" />
                    <span className="font-bold text-xl font-headline text-foreground">
                      Di
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-lg font-medium transition-colors hover:text-primary text-foreground"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/creator/dashboard"
                  className="text-lg font-medium transition-colors hover:text-primary text-foreground"
                >
                  Menjadi Kreator
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 hidden sm:block" />
            <span className="hidden font-bold sm:inline-block font-headline">
              
            </span>
          </Link>
        </div>

        {navLinks.length > 0 && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-primary-foreground/80 text-primary-foreground/60"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Center Section (Search) */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari produk..."
                className="w-full bg-background/90 text-foreground pl-10 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Right Section (Actions) */}
        <div className="flex items-center justify-end space-x-2">
          {!user && !loading && (
            <Button variant="secondary" className="hidden sm:inline-flex" asChild>
              <Link href="/creator/dashboard">Menjadi Kreator</Link>
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
