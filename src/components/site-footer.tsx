import { SlidersHorizontal, Twitter, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SiteFooter() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <SlidersHorizontal className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">FilterForge</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              The ultimate marketplace for creators to buy and sell high-quality
              presets, LUTs, and digital assets.
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

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Top Creators
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-1">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Join our newsletter for new products and special offers.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-background"/>
              <Button type="submit" variant="default">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FilterForge. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
