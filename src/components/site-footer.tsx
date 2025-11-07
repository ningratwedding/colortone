import { SlidersHorizontal, Twitter, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SiteFooter() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <SlidersHorizontal className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">FilterForge</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Sebuah panggung bagi para pencerita visual untuk berbagi karya terbaik mereka. Temukan preset dan LUT yang mengubah momen menjadi kenangan.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-semibold mb-4">Tetap Terkini</h3>
            <p className="text-muted-foreground mb-4">
              Bergabunglah dengan buletin kami untuk produk baru dan penawaran khusus.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-background"/>
              <Button type="submit" variant="default">Berlangganan</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FilterForge. Semua Hak Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
