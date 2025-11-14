
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Inline SVG for Apple Icon
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.15,1.901c-2.008,0.008-3.832,1.223-4.66,3.01c-0.12,0.26-0.2,0.54-0.22,0.82c-0.09,1.13,0.3,2.26,1.12,3.09 c0.78,0.78,1.88,1.2,3,1.2c0.1,0,0.2,0,0.3,0c-0.1,0-0.2,0-0.3,0c-1.12,0-2.22-0.42-3-1.2c-0.82-0.83-1.21-1.96-1.12-3.09 c0.02-0.28,0.1-0.56,0.22-0.82c0.828-1.787,2.652-3.002,4.66-3.01c0.55,0,1.08,0.12,1.56,0.33c0.82,0.36,1.52,0.96,2.02,1.72 c0.48-0.78,1.23-1.4,2.09-1.77c0.47-0.2,0.98-0.3,1.49-0.29c1.9,0.08,3.58,1.39,4.3,3.16c0.01,0.02,0.02,0.04,0.03,0.06 c-1.5,0.93-2.43,2.65-2.4,4.56c0.03,1.83,0.91,3.49,2.32,4.47c-0.14,0.3-0.3,0.6-0.47,0.88c-0.87,1.48-1.96,2.73-3.26,3.71 c-0.65,0.48-1.37,0.85-2.12,1.07c-0.03,0.01-0.06,0.02-0.09,0.03c-0.8,0.23-1.65,0.23-2.45,0c-0.74-0.22-1.45-0.58-2.09-1.05 c-1.29-0.96-2.38-2.2-3.24-3.65c-0.01-0.01-0.01-0.02-0.02-0.03c-1.46-2.34-1.98-5.17-1.1-7.8c0.6-1.72,1.89-3.07,3.52-3.77 C11.07,2.011,11.6,1.901,12.15,1.901z M11.5,0c-0.67,0-1.32,0.14-1.92,0.41c-2.12,0.94-3.77,2.83-4.52,5.16 c-1.1,3.41-0.45,7.18,1.67,9.91c0.91,1.15,2.03,2.1,3.31,2.81c0.89,0.5,1.87,0.83,2.88,0.83c0.12,0,0.24-0.01,0.36-0.02 c0.98-0.08,1.93-0.39,2.79-0.89c0.88-0.51,1.66-1.18,2.32-1.97c0.8-0.95,1.34-2.12,1.56-3.4c0.02-0.12,0.03-0.23,0.03-0.35 c0-0.13-0.01-0.25-0.03-0.37c-0.16-0.9-0.5-1.74-0.97-2.49c-1.29-2.05-3.56-3.3-6.07-3.3c-0.1,0-0.2,0-0.3,0.01 c-0.15,0.01-0.29,0.03-0.44,0.06c1.72-1.33,2.8-3.48,2.65-5.87C14.7,3.221,13.51,1.961,11.96,1.911C11.79,1.911,11.64,1.901,11.5,1.901 L11.5,0z" />
  </svg>
);

// Inline SVG for Android Icon
const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.329 10.205c-.328 1.546-1.58 2.8-3.131 3.129v3.457h-3.999v-3.457C8.653 13.005 7.4 11.75 7.07 10.205H4v5.039c0 1.94 1.252 3.585 3.033 4.053v2.802h2.001v-2.735h4.331v2.735h2.001v-2.802c1.78-.468 3.033-2.113 3.033-4.053v-5.039h-3.094zM8.535 5.253l-1.3 1.3c-.563.562-.563 1.472 0 2.034l1.3 1.3c.563.563 1.473.563 2.035 0l1.3-1.3c.562-.563.562-1.472 0-2.034l-1.3-1.3c-.562-.562-1.472-.562-2.035 0zm7.331 0c-.563-.562-1.472-.562-2.035 0l-1.3 1.3c-.562-.562-.562 1.472 0 2.034l1.3 1.3c.563._563 1.473.563 2.035 0l1.3-1.3c.562-.563.562-1.472 0-2.034l-1.3-1.3z" />
  </svg>
);

export default function DownloadPage() {
  return (
    <div className="bg-background">
        <div className="relative bg-gradient-to-r from-primary to-[hsl(210,90%,55%)] text-primary-foreground overflow-hidden">
            <div className="container mx-auto px-4 py-12 md:py-20 text-center relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">
                    Unduh Aplikasi LinkPro
                </h1>
                <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-primary-foreground/90">
                    Akses semua fitur, kelola produk, dan berinteraksi dengan komunitas langsung dari perangkat seluler Anda.
                </p>
            </div>
             <div className="absolute -bottom-1 left-0 w-full h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
        </div>

        <div className="container mx-auto max-w-4xl px-4 pb-8 md:pb-12 -mt-8 relative z-20">
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    <Button size="lg" asChild className="h-14 text-base">
                    <Link href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                        <AppleIcon className="h-6 w-6 mr-2.5 fill-current" />
                        <div>
                        <p className="text-xs text-left">Download on the</p>
                        <p className="text-lg font-semibold text-left -mt-1">App Store</p>
                        </div>
                    </Link>
                    </Button>
                    <Button size="lg" asChild className="h-14 text-base bg-[#000] hover:bg-[#111] text-white">
                    <Link href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                        <AndroidIcon className="h-7 w-7 mr-2.5" />
                        <div>
                        <p className="text-xs text-left uppercase">Get it on</p>
                        <p className="text-lg font-semibold text-left -mt-1">Google Play</p>
                        </div>
                    </Link>
                    </Button>
                </div>

                <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-xl font-semibold">Pengalaman Terbaik di Tangan Anda</h3>
                    <ul className="space-y-2 text-muted-foreground list-inside md:list-none">
                    <li className="flex items-center justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        Notifikasi instan untuk penjualan dan interaksi.
                    </li>
                    <li className="flex items-center justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        Unggah dan kelola produk Anda di mana saja.
                    </li>
                    <li className="flex items-center justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        Antarmuka yang dioptimalkan untuk pengalaman mobile.
                    </li>
                    </ul>
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
