import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { products, categories, software } from "@/lib/data";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          Setiap Warna Bercerita
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Di balik setiap foto dan video, ada sebuah cerita yang menunggu untuk diungkap. Temukan preset dan LUT yang menghidupkan narasi visual Anda, dibuat oleh para pencerita visual terbaik di dunia.
        </p>
      </header>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full" />
        <div className="flex gap-4 w-full md:w-auto">
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-full md:w-[180px] bg-card">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all-software">
            <SelectTrigger className="w-full md:w-[180px] bg-card">
              <SelectValue placeholder="Perangkat Lunak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-software">Semua Perangkat Lunak</SelectItem>
              {software.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="mb-8" />

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
