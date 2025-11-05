import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function FavoritesPage() {
  const favoriteProducts = products.filter((p, i) => i % 2 === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
          Favorit Saya
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Koleksi preset dan LUT pilihan Anda.
        </p>
      </header>

      <Separator className="mb-8" />

      {favoriteProducts.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Belum Ada Favorit</h2>
            <p className="mt-2 text-muted-foreground">Klik ikon hati pada produk apa pun untuk menyimpannya di sini.</p>
        </div>
      )}
    </div>
  );
}
