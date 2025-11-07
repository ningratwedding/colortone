import Image from "next/image";
import { products, reviews as allReviews } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  CheckCircle,
  Tag,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const reviews = allReviews.slice(0, 2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="grid grid-cols-1 gap-4">
            <div className="group">
              <h3 className="font-semibold mb-2 text-center text-muted-foreground">Sebelum</h3>
              <Image
                src={product.imageBefore.imageUrl}
                alt={`${product.name} (Sebelum)`}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full shadow-md"
                data-ai-hint={product.imageBefore.imageHint}
              />
            </div>
            <div className="group">
              <h3 className="font-semibold mb-2 text-center text-muted-foreground">Sesudah</h3>
              <Image
                src={product.imageAfter.imageUrl}
                alt={`${product.name} (Sesudah)`}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full shadow-md"
                data-ai-hint={product.imageAfter.imageHint}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2 group">
                    <Avatar>
                        <AvatarImage src={product.creator.avatar.imageUrl} data-ai-hint={product.creator.avatar.imageHint} />
                        <AvatarFallback>{product.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium group-hover:text-primary transition-colors">{product.creator.name}</span>
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-muted-foreground text-sm">({product.reviewsCount} ulasan)</span>
                </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <div className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-5 w-5" /> Tambah ke Keranjang
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Heart className="mr-2 h-5 w-5" /> Favorit
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6 grid gap-4 text-sm">
                <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary"/>
                    <span>Kompatibel dengan: {product.software.map(s => s.name).join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-primary"/>
                    <span>Unduhan digital instan</span>
                </div>
                <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-primary"/>
                    <div className="flex flex-wrap gap-2">
                       {product.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6 font-headline">Ulasan</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                {reviews.map((review) => (
                <Card key={review.id}>
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={review.user.avatar.imageUrl} data-ai-hint={review.user.avatar.imageHint} />
                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{review.user.name}</CardTitle>
                            <CardDescription>{review.date}</CardDescription>
                        </div>
                        </div>
                        <StarRating rating={review.rating} />
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                </Card>
                ))}
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Tinggalkan Ulasan</CardTitle>
                        <CardDescription>Bagikan pemikiran Anda dengan komunitas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="font-medium text-sm mb-2 block">Peringkat Anda</span>
                            <StarRating rating={0} />
                        </div>
                         <Textarea placeholder="Tulis ulasan Anda di sini..."/>
                         <Button>Kirim Ulasan</Button>
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </div>
  );
}
