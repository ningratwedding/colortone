import { Handshake, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/config';

export default function AboutPage() {
    const vision =
    "Menciptakan ekosistem digital yang setara, di mana setiap UMKM di Indonesia memiliki kesempatan untuk tumbuh, berinovasi, dan menjangkau pasar yang lebih luas tanpa batas.";

  const missions = [
    'Menyediakan platform yang mudah digunakan bagi UMKM untuk membangun etalase digital yang profesional.',
    'Memberdayakan pelaku UMKM dengan alat penjualan dan pemasaran yang efektif untuk meningkatkan pendapatan.',
    'Membangun komunitas yang suportif untuk para pelaku UMKM saling berbagi, belajar, dan berkolaborasi.',
    'Menjembatani UMKM dengan pelanggan setia melalui program reseller dan fitur interaksi.',
    'Mendorong pertumbuhan ekonomi lokal dengan mempermudah akses pasar bagi produk-produk UMKM.',
    'Memberikan data dan wawasan untuk membantu UMKM mengambil keputusan bisnis yang lebih baik.',
  ];

  const commitment =
    'Kami berkomitmen untuk menjadi mitra terpercaya bagi setiap UMKM di Indonesia. Kami menyediakan teknologi, dukungan, dan ruang untuk memastikan setiap langkah pertumbuhan bisnis Anda lebih mudah, lebih cepat, dan lebih berdampak.';

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Tentang {siteConfig.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">Memberdayakan UMKM Indonesia untuk bertumbuh dan berjaya.</p>
        </header>

        {/* Komitmen Section */}
        <div className="text-center bg-muted/50 rounded-lg p-8 md:p-12">
            <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-4">Komitmen Kami</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {commitment}
            </p>
        </div>

        {/* Visi Section */}
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="text-center items-center">
            <CardTitle className="text-2xl font-headline">Visi Kami</CardTitle>
            <Separator className="my-3 w-1/4" />
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
              {vision}
            </p>
          </CardContent>
        </Card>

        {/* Misi Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">
            Misi Kami
          </h2>
          <Separator className="my-4 mx-auto w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mt-8">
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
      </div>
    </div>
  );
}
