
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function SiteFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                 <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-muted-foreground">
                    <Link href="/about" className="hover:text-primary">Tentang Kami</Link>
                    <Link href="/products" className="hover:text-primary">Jelajahi Produk UMKM</Link>
                    <Link href="/privacy" className="hover:text-primary">Kebijakan Privasi</Link>
                    <Link href="/terms" className="hover:text-primary">Ketentuan Layanan</Link>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                    <p>
                        &copy; {new Date().getFullYear()} {siteConfig.name}. Dibuat oleh{' '}
                        <a
                            href="https://dimas-sujatmiko.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-4 hover:text-primary"
                        >
                            Dimas
                        </a>.
                    </p>
                </div>
            </div>
        </footer>
    );
}
