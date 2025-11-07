import Image from "next/image";
import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Tag,
  Download,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ImageCompareSlider } from "@/components/image-compare-slider";
import { ProductClientContent } from "./product-client-content";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ImageCompareSlider
            beforeImage={product.imageBefore}
            afterImage={product.imageAfter}
            className="aspect-[3/2] rounded-lg overflow-hidden"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-4">
                <Link href={`/creator/${product.creator.id}`} className="flex items-center gap-2 group">
                    <Avatar>
                        <AvatarImage src={product.creator.avatar.imageUrl} data-ai-hint={product.creator.avatar.imageHint} />
                        <AvatarFallback>{product.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium group-hover:text-primary transition-colors">{product.creator.name}</span>
                </Link>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <ProductClientContent price={product.price} />

          <Card className="rounded-lg">
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
    </div>
  );
}
