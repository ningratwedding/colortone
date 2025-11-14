
"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto w-full max-w-none flex h-16 items-center justify-center px-4">
                 <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}
