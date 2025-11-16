'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Layers, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  const features = [
    {
      icon: Camera,
      title: 'Pratinjau Before-After',
      description: 'Lihat efek preset dan LUT secara langsung dengan slider interaktif kami.',
    },
    {
      icon: Layers,
      title: 'Dukungan Multi-Platform',
      description: 'Temukan aset untuk berbagai perangkat lunak, mulai dari Lightroom, Photoshop, hingga Final Cut Pro.',
    },
    {
      icon: Search,
      title: 'Pencarian Cerdas',
      description: 'Cari preset berdasarkan tag, kategori, atau nama kreator dengan mudah.',
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[hsl(240,60%,55%)] text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            FilterForge
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
            Temukan Dunia Baru Visual. Marketplace Terbaik untuk Preset & LUTs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/products">Jelajahi Sekarang</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link href="/creator/dashboard">Menjadi Kreator</Link>
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
            Fitur Unggulan FilterForge
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-left bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
