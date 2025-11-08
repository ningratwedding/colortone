"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductClientContent({
  price,
  productId,
}: {
  price: number;
  productId: string;
}) {
  const [formattedPrice, setFormattedPrice] = useState<string>("");

  useEffect(() => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };
    setFormattedPrice(formatCurrency(price));
  }, [price]);

  return (
    <>
      <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href={`/login`}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Beli Sekarang
            </Link>
        </Button>
      </div>
    </>
  );
}
