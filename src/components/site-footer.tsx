
"use client";

import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="container flex h-16 items-center">
                <p className="text-center text-sm leading-loose text-muted-foreground w-full">
                    &copy; {new Date().getFullYear()} FilterForge. Semua hak dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}
