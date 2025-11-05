import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { products } from "@/lib/data";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const cartItems = products.slice(0, 2);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Pembayaran</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input id="email" type="email" placeholder="anda@contoh.com" />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
              <CardDescription>Semua transaksi aman dan terenkripsi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Nomor Kartu</Label>
                <Input id="card-number" placeholder="**** **** **** ****" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="expiry-date">Tanggal Kedaluwarsa</Label>
                  <Input id="expiry-date" placeholder="BB / TT" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="name-on-card">Nama pada Kartu</Label>
                <Input id="name-on-card" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.imageAfter.imageUrl}
                      alt={item.name}
                      width={64}
                      height={42}
                      className="rounded-md"
                      data-ai-hint={item.imageAfter.imageHint}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Oleh {item.creator.name}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pajak</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Selesaikan Pembelian
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
