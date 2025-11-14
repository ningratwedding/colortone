
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Flag, Handshake, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function Home() {
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

  const commitment =
    'Kami berkomitmen hadir sebagai mitra perjalanan kreator menyediakan dukungan, teknologi, dan ruang yang memastikan setiap langkah mereka selalu memiliki arah, makna, dan harapan untuk terus maju.';

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo className="h-12 w-auto" />
            <span className="text-4xl font-bold mt-2">LinkStore</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline">
            Ruang Anda untuk Berkarya dan Bertumbuh
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-primary-foreground/90">
            Temukan potensi kreatif Anda. LinkStore adalah tempat para kreator
            menemukan, berbagi, dan menjual karya unik mereka.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Mulai Sekarang, Gratis</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Jelajahi Produk</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 w-full h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-12 md:space-y-16">
        {/* Visi Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <Target className="mx-auto h-12 w-12 text-primary mb-2" />
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
              <Card key={index} className="flex bg-white">
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{mission}</p>
                </CardContent>
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
