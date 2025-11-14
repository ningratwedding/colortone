
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function SiteFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="flex justify-center">
                    <Logo className="h-7 text-primary" />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi undang-undang.
                    </p>
                    <p>
                        Dibuat dengan <Link href="/" className="font-semibold text-primary hover:underline">LinkStore</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
