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
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          Mewadahi Kreativitas Visual
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Misi kami adalah menjadi platform terdepan yang memberdayakan para pencerita visual. Kami menyediakan ruang di mana para kreator dapat berbagi karya, menginspirasi, dan mengubah gairah mereka menjadi peluang.
        </p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-end">
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

      <Separator className="mb-6" />

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
