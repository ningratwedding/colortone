"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase/auth/use-user";

export function ProductClientContent({
  price,
  productId,
}: {
  price: number;
  productId: string;
}) {
  const { user, loading } = useUser();
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

  const getCheckoutUrl = () => {
    if (loading) return "#"; // Or a loading state
    if (user) {
      return `/checkout?productId=${productId}`;
    }
    return `/login?redirect=/product/${productId}`;
  };

  return (
    <>
      <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button size="lg" className="w-full sm:w-auto" asChild disabled={loading}>
            <Link href={getCheckoutUrl()}>
                <ShoppingCart className="mr-2 h-4 w-4" /> 
                {loading ? "Memuat..." : "Beli Sekarang"}
            </Link>
        </Button>
      </div>
    </>
  );
}
