
"use client";

import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto w-full max-w-none flex h-16 items-center justify-center px-4">
                 <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Di. Semua hak dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}

