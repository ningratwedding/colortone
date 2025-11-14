import { Handshake, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/config';

export default function AboutPage() {
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
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Tentang {siteConfig.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">Membangun ekosistem untuk kreator bertumbuh dan berkarya.</p>
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
