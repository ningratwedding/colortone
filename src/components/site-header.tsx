
'use client';

import Link from 'next/link';
import {
  CircleUserRound,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  Shield,
  LogOut,
  LogIn
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const navLinks: { href: string; label: string }[] = [
];

export function SiteHeader() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Berhasil Keluar", description: "Anda telah keluar dari akun Anda."});
    router.push('/');
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Left Section (Logo and Mobile Menu) */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2" aria-label="Alihkan Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2">
                    <SlidersHorizontal className="h-8 w-8 text-primary" />
                    <span className="font-bold text-xl font-headline">
                      Colortone
                    </span>
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

          <Link href="/" className="mr-6 flex items-center space-x-2">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Colortone
            </span>
          </Link>
        </div>
        
        {navLinks.length > 0 && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
          )}
        
        {/* Center Section (Search) */}
        <div className="flex-1 flex justify-center px-4">
           <div className="w-full max-w-sm">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari preset..."
                  className="w-full bg-card pl-10 rounded-full"
                />
              </div>
           </div>
        </div>

        {/* Right Section (Actions) */}
        <div className="flex items-center justify-end space-x-2">
           {!user && !loading && (
             <Button variant="outline" className="hidden sm:inline-flex" asChild>
                <Link href="/login">Menjadi Kreator</Link>
              </Button>
           )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu Pengguna">
                  {user ? (
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL || ''} />
                       <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                     </Avatar>
                  ) : (
                     <CircleUserRound className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user ? user.displayName || "Akun Saya" : "Akun Saya"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                   <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/creator/dashboard">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          <span>Dasbor Kreator</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/account/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Pengaturan Akun</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Dasbor Admin</span>
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
        </div>
      </div>
    </header>
  );
}

