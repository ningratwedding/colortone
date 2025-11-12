
"use client";

import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between py-4 sm:py-0 gap-4">
                 <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Di. Semua hak dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}
