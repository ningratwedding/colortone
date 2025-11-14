
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function SiteFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                 <div className="flex flex-col items-center gap-4">
                    <Logo className="h-7 text-primary" />
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <Link href="/terms" className="hover:text-primary transition-colors">Ketentuan</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privasi</Link>
                        <Link href="/download" className="hover:text-primary transition-colors">Download</Link>
                    </div>
                 </div>
                 <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}
