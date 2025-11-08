
'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Monitor, Smartphone, Video, Wand2, ArrowRight } from 'lucide-react';

const tutorialCategories = [
    {
        title: 'Desktop (Foto)',
        description: 'Instalasi preset (.XMP) di Adobe Lightroom Classic dan Adobe Photoshop.',
        icon: Monitor,
        href: '/tutorial/installation/desktop-photo',
    },
    {
        title: 'Mobile (Foto)',
        description: 'Instalasi preset (.DNG) di Adobe Lightroom Mobile di perangkat iOS atau Android.',
        icon: Smartphone,
        href: '/tutorial/installation/mobile-photo',
    },
    {
        title: 'Video Editing',
        description: 'Instalasi LUTs (.CUBE) di Premiere Pro, DaVinci Resolve, CapCut, dan lainnya.',
        icon: Video,
        href: '/tutorial/installation/video-editing',
    }
]


export default function InstallationTutorialHubPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="items-center text-center p-6 mb-4">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-headline">
            Panduan Instalasi
          </h1>
          <p className="text-base text-muted-foreground max-w-prose mx-auto mt-2">
            Pilih perangkat lunak yang Anda gunakan untuk melihat panduan instalasi langkah-demi-langkah yang mendetail.
          </p>
      </header>

      <div className="grid gap-4 md:grid-cols-1">
        {tutorialCategories.map((category) => (
            <Card key={category.href} className="hover:border-primary/50 transition-colors">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground flex-shrink-0">
                            <category.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <CardDescription className="text-sm">{category.description}</CardDescription>
                        </div>
                    </div>
                    <Button asChild variant="outline" size="icon">
                        <Link href={category.href}>
                            <ArrowRight className="h-4 w-4" />
                            <span className="sr-only">Lihat Panduan</span>
                        </Link>
                    </Button>
                </CardHeader>
            </Card>
        ))}
      </div>
    </div>
  );
}
