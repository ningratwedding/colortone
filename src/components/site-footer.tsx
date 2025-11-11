
"use client";

import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between py-4 sm:py-0 gap-4">
                 <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Di. Semua hak dilindungi undang-undang.
                </p>
                <nav className="flex items-center gap-4 sm:gap-6 text-sm">
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                        Ketentuan Layanan
                    </Link>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                        Kebijakan Privasi
                    </Link>
                    <Link href="/download" className="text-muted-foreground hover:text-primary transition-colors">
                        Download App
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
