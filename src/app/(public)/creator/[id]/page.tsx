import { notFound } from 'next/navigation';
import { users, products } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { Instagram } from 'lucide-react';
import Link from 'next/link';

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  const creator = users.find((user) => user.id === params.id);

  if (!creator) {
    notFound();
  }

  const creatorProducts = products.filter((product) => product.creator.id === creator.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 flex flex-col items-center text-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={creator.avatar.imageUrl} alt={creator.name} data-ai-hint={creator.avatar.imageHint} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold font-headline">{creator.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-xl">
          {creator.bio}
        </p>
        {creator.socials?.instagram && (
          <div className="mt-4">
            <Link 
              href={`https://instagram.com/${creator.socials.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>{creator.socials.instagram}</span>
            </Link>
          </div>
        )}
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-6 font-headline text-center">
          Produk oleh {creator.name}
        </h2>
        {creatorProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {creatorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {creator.name} belum memiliki produk apa pun.
          </p>
        )}
      </main>
    </div>
  );
}
