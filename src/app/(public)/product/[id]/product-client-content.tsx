"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export function ProductClientContent({
  price,
}: {
  price: number;
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
      <div className="text-4xl font-bold text-primary">{formattedPrice}</div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="w-full sm:w-auto">
          <CreditCard className="mr-2 h-5 w-5" /> Beli Sekarang
        </Button>
      </div>
    </>
  );
}
