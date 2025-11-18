
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, CheckCircle, Package, Link2, Users, Palette, BarChart, Heart } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase/auth/use-user';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [slug, setSlug] = useState('');
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  
  const placeholderTexts = useMemo(() => ['nama-kreator', 'seniman-hebat', 'fotografer-pro'], []);
  const [placeholder, setPlaceholder] = useState(placeholderTexts[0]);
  
  useEffect(() => {
    let currentTextIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typeSpeed = 150;

    const type = () => {
      const fullText = placeholderTexts[currentTextIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setPlaceholder(currentText);

      if (!isDeleting && currentText === fullText) {
        // Pause at end
        isDeleting = true;
        typeSpeed = 2000; // Pause duration
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length;
        typeSpeed = 500; // Pause before typing new word
      } else {
        typeSpeed = isDeleting ? 100 : 150;
      }
      
      setTimeout(type, typeSpeed);
    };

    const typingTimeout = setTimeout(type, typeSpeed);
    return () => clearTimeout(typingTimeout);
  }, [placeholderTexts]);

  const handleClaimUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slug) {
      router.push(`/signup?slug=${slug}`);
    }
  };

    const features = [
    {
      icon: Package,
      title: 'Jual Produk Digital & Fisik',
      description: 'Satu tempat untuk semua karya Anda, mulai dari preset, e-book, hingga merchandise.',
    },
    {
      icon: Link2,
      title: 'Halaman Profil Profesional',
      description: 'Gabungkan semua tautan sosial media, portofolio, dan kontak dalam satu profil yang menarik.',
    },
    {
      icon: Users,
      title: 'Program Afiliasi',
      description: 'Perluas jangkauan penjualan Anda dengan memberdayakan audiens untuk menjadi mitra afiliasi.',
    },
    {
      icon: Palette,
      title: 'Kustomisasi Tampilan',
      description: 'Sesuaikan warna, font, dan tata letak halaman agar benar-benar mencerminkan brand Anda.',
    },
     {
      icon: BarChart,
      title: 'Analitik & Insight',
      description: 'Pahami audiens Anda lebih dalam dengan data kunjungan dan performa produk yang mudah dibaca.',
    },
    {
      icon: Heart,
      title: 'Terima Dukungan',
      description: 'Aktifkan fitur donasi atau tip untuk memungkinkan penggemar memberikan dukungan finansial langsung.',
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
             {userLoading ? (
              <Skeleton className="h-9 w-20 rounded-md" />
            ) : (
              <Button variant="ghost" className="hover:bg-primary-foreground/10" asChild>
                  <Link href={user ? '/account/settings' : '/login'}>{user ? 'Pengaturan' : 'Masuk'}</Link>
              </Button>
            )}
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo className="h-12 w-auto mb-4 text-white" />
            <h1 className="text-3xl md:text-5xl font-bold font-headline">
                Satu Platform, Semua Kebutuhan Kreator
            </h1>
          </div>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-primary-foreground/90">
            LinkStore memberikan Anda semua alat yang dibutuhkan untuk membangun audiens, menjual produk, dan mengembangkan brand Anda.
          </p>
          <div className="mt-8 mx-auto max-w-lg flex flex-col sm:flex-row items-center justify-center gap-2">
            <form onSubmit={handleClaimUsername} className="w-full sm:w-auto sm:flex-grow">
                <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">linkstore.id/</span>
                <Input
                    type="text"
                    placeholder={placeholder}
                    className="h-12 w-full rounded-full bg-background/90 text-foreground pl-[130px] pr-[100px] text-base"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    aria-label="Klaim nama pengguna Anda"
                />
                <Button
                    type="submit"
                    size="lg"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-9"
                >
                    Buat
                </Button>
                </div>
            </form>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto h-12 rounded-full flex-shrink-0">
                <Link href="/products">Lihat Produk</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 w-full h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-12 md:space-y-16">
        
        {/* Features Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline mb-8">
            Fitur Unggulan untuk Kreator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-left bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
