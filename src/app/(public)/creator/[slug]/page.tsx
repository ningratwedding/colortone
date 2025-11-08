
import { notFound } from 'next/navigation';
import { users, products } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12.528 8.001v5.25c-1.423.115-2.585.83-3.415 1.942C8.253 16.34 7.6 17.34 6.75 17.34c-1.84 0-2.5-1.72-2.5-1.72" />
            <path d="M12.528 8.001c.883-2.48 3.02-3.514 5.31-2.07C20.137 7.37 20.08 11.2 17 11.2v5.123c-1.872 0-3.352-1.33-4.472-2.37" />
            <path d="M12.528 8.001q.44-1.47.79-2.515" />
            <path d="M17.5 4.5c.31.02.62.06.94.13" />
        </svg>
    )
}

const socialLinks = {
  instagram: {
    url: 'https://instagram.com/',
    icon: <Instagram className="h-5 w-5" />,
  },
  facebook: {
    url: 'https://facebook.com/',
    icon: <Facebook className="h-5 w-5" />,
  },
  tiktok: {
    url: 'https://tiktok.com/@',
    icon: <TikTokIcon className="h-5 w-5" />,
  }
};


export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
  const creator = users.find((user) => user.slug === params.slug);

  if (!creator) {
    notFound();
  }

  const creatorProducts = products.filter((product) => product.creator.id === creator.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col items-center text-center">
        <Avatar className="h-32 w-32">
          <AvatarImage src={creator.avatar.imageUrl} alt={creator.name} data-ai-hint={creator.avatar.imageHint} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold font-headline mt-4">{creator.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-xl">
          {creator.bio}
        </p>
        
        <div className="mt-4 flex items-center gap-4">
          {creator.socials && Object.entries(creator.socials).map(([platform, username]) => {
              const social = socialLinks[platform as keyof typeof socialLinks];
              if (!social || !username) return null;
              return (
                  <Link 
                      key={platform}
                      href={`${social.url}${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                      {social.icon}
                  </Link>
              )
          })}
        </div>
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-6 font-headline text-center">
          Produk oleh {creator.name}
        </h2>
        {creatorProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
