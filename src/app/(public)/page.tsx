
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Flag, Handshake, CheckCircle, Package, Link2, Users, Palette, BarChart, Heart } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [slug, setSlug] = useState('');
  const router = useRouter();
  
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


  const vision =
    "Kami ingin membangun sebuah ruang di mana setiap kreator dapat tumbuh tanpa rasa takut akan batasan sebuah ekosistem yang membuka jalan bagi mimpi, memperluas peluang, dan memberi harapan bahwa karya mereka dapat menjadi jembatan menuju masa depan yang lebih cerah.";

  const missions = [
    'Membantu kreator menemukan lebih banyak peluang untuk mengembangkan nilai dan pendapatan dari karya mereka.',
    'Menyediakan pusat yang menyatukan seluruh identitas digital kreator agar mereka tampil lebih rapi, profesional, dan mudah dikenal.',
    'Mendukung kreator menjual karya digital maupun fisik, serta berbagi pengetahuan melalui berbagai format.',
    'Membangun ruang komunitas yang memungkinkan kreator berinteraksi, bertumbuh, dan menginspirasi satu sama lain.',
    'Memberikan alat yang sederhana namun bertenaga, sehingga kreator dapat fokus berkarya tanpa terbebani teknis.',
    'Menyediakan insight yang jelas untuk membantu kreator memahami audiens, mengukur dampak, dan merancang langkah pertumbuhan berikutnya.',
  ];

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

  const testimonials = [
    {
        quote: "Platform ini sangat intuitif! Dalam beberapa menit, profil saya sudah aktif dan produk pertama saya siap dijual. Fitur kustomisasinya luar biasa.",
        name: "Andini Putri",
        role: "Fotografer & Kreator Preset",
        avatar: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwb3J0cmFpdCUyMGFzaWFuJTIwd29tYW58ZW58MHx8fHwxNzYyODg3MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: "asian woman"
    },
    {
        quote: "Fitur afiliasi adalah game-changer. Audiens saya kini bisa ikut mempromosikan produk dan kami sama-sama mendapat keuntungan. Ini benar-benar win-win solution.",
        name: "Bagus Wicaksono",
        role: "Videografer & Edukator",
        avatar: "https://images.unsplash.com/photo-1542978712-79c3209507e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxpbmRvbmVzaWFuJTIwbWFufGVufDB8fHx8MTc2Mjg4NzUwMnww&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: "indonesian man"
    },
    {
        quote: "Saya suka bagaimana LinkStore menyatukan semua tautan saya di satu tempat. Profil saya jadi terlihat jauh lebih profesional dan terorganisir.",
        name: "Citra Lestari",
        role: "Desainer Grafis & Ilustrator",
        avatar: "https://images.unsplash.com/photo-1609505848937-27497e8493b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwd29tYW58ZW58MHx8fHwxNzYyODg3NTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: "indonesian woman"
    },
  ];

  const commitment =
    'Kami berkomitmen hadir sebagai mitra perjalanan kreator menyediakan dukungan, teknologi, dan ruang yang memastikan setiap langkah mereka selalu memiliki arah, makna, dan harapan untuk terus maju.';

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo className="h-12 w-auto" />
            <span className="text-4xl font-bold mt-2 font-headline">LinkStore</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline">
            Ruang Anda untuk Berkarya dan Bertumbuh
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-primary-foreground/90">
            Temukan potensi kreatif Anda. LinkStore adalah tempat para kreator
            menemukan, berbagi, dan menjual karya unik mereka.
          </p>
          <form onSubmit={handleClaimUsername} className="mt-8 mx-auto max-w-md">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">linkstore.id/</span>
              <Input
                type="text"
                placeholder={placeholder}
                className="h-12 w-full rounded-full bg-background/90 text-foreground pl-[120px] pr-[100px] text-base"
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
        </div>
        <div className="absolute -bottom-1 left-0 w-full h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-12 md:space-y-16">
        {/* Visi Section */}
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="text-center">
            
            <CardTitle className="text-2xl font-headline">Visi Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
              {vision}
            </p>
          </CardContent>
        </Card>

        {/* Misi Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline mb-8">
            Misi Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {missions.map((mission, index) => (
              <Card key={index} className="flex bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-4 flex items-start space-x-2">
                  <div className="flex-shrink-0 pt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{mission}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
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
        
        {/* Testimonials Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline mb-8">
            Apa Kata Para Kreator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-6 flex-grow">
                  <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
                 <CardHeader className="p-6 pt-0 flex flex-row items-center gap-4">
                   <Avatar>
                        <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.avatarHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                   <div className="text-left">
                     <p className="font-semibold text-sm">{testimonial.name}</p>
                     <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                   </div>
                 </CardHeader>
              </Card>
            ))}
          </div>
        </div>


        {/* Komitmen Section */}
        <div className="text-center bg-muted/50 rounded-lg p-8 md:p-12">
            <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-4">Komitmen Kami</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {commitment}
            </p>
        </div>
      </div>
    </div>
  );
}
