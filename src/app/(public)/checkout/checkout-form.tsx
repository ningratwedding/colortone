
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Product, UserProfile } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, Home, Loader2, Package, Terminal, Truck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';


const shippingOptions = [
  { id: 'reguler', name: 'Reguler', price: 15000, estimation: '2-4 hari' },
  { id: 'express', name: 'Express', price: 30000, estimation: '1-2 hari' },
];

export default function CheckoutForm({ product }: { product?: Product }) {
  const { user, loading: userLoading } = useUser();
  const [formattedSubtotal, setFormattedSubtotal] = useState('');
  const [formattedTax, setFormattedTax] = useState('');
  const [formattedShipping, setFormattedShipping] = useState('');
  const [formattedTotal, setFormattedTotal] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const creatorRef = useMemo(() => {
    if (!firestore || !product?.creatorId) return null;
    return doc(firestore, 'users', product.creatorId);
  }, [firestore, product?.creatorId]);
  
  const { data: creator } = useDoc<UserProfile>(creatorRef);

  useEffect(() => {
    if (!product) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const subtotal = product.price;
    const tax = product.type === 'digital' ? subtotal * 0.08 : 0;
    const shippingCost = product.type === 'fisik' 
        ? shippingOptions.find(s => s.id === selectedShipping)?.price || 0 
        : 0;
    const total = subtotal + tax + shippingCost;

    setFormattedSubtotal(formatCurrency(subtotal));
    setFormattedTax(formatCurrency(tax));
    setFormattedShipping(formatCurrency(shippingCost));
    setFormattedTotal(formatCurrency(total));
    setFormattedPrice(formatCurrency(product.price));
  }, [product, selectedShipping]);
  
  const handleProceedToPayment = async () => {
    if (!user) {
      router.push(`/login?redirect=/checkout?productId=${product?.id}`);
      return;
    }
    if (!product || !firestore) return;

    setIsProcessing(true);
    
    try {
      const affiliateRefId = searchParams.get('ref') || sessionStorage.getItem('affiliate_ref');

      const totalAmount = product.price + 
        (product.type === 'digital' ? product.price * 0.08 : 0) +
        (product.type === 'fisik' ? (shippingOptions.find(s => s.id === selectedShipping)?.price || 0) : 0);
        
      const orderData: any = {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        creatorId: product.creatorId,
        purchaseDate: serverTimestamp(),
        amount: totalAmount,
        status: 'Menunggu Pembayaran' as const,
      };

      if (affiliateRefId && affiliateRefId !== user.uid) {
        const affiliateRef = doc(firestore, 'users', affiliateRefId);
        const affiliateSnap = await getDoc(affiliateRef);
        if (affiliateSnap.exists() && affiliateSnap.data().role === 'affiliator') {
          orderData.affiliateId = affiliateRefId;
        }
      }

      const orderRef = await addDoc(collection(firestore, `users/${user.uid}/orders`), orderData);
      
      if (sessionStorage.getItem('affiliate_ref')) {
        sessionStorage.removeItem('affiliate_ref');
      }
      
      router.push(`/checkout/confirmation?orderId=${orderRef.id}`);

    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Pesanan',
        description: 'Terjadi kesalahan. Silakan coba lagi.'
      });
      setIsProcessing(false);
    }
  };


  if (!product) {
    return (
        <div className="container mx-auto px-4 py-6">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Produk tidak ditemukan!</AlertTitle>
                <AlertDescription>
                    Sepertinya Anda belum memilih produk. Silakan kembali ke halaman utama untuk memilih produk.
                    <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
  }
  
  const isPhysicalProduct = product.type === 'fisik';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address for Physical Products */}
          {isPhysicalProduct && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" /> Alamat Pengiriman</CardTitle>
                <CardDescription>Masukkan detail alamat tujuan pengiriman produk Anda.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Penerima</Label>
                  <Input id="name" placeholder="Nama lengkap Anda" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" type="tel" placeholder="08123456789" />
                </div>
                <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Input id="address" placeholder="Nama jalan, nomor rumah, RT/RW" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="city">Kota/Kabupaten</Label>
                  <Input id="city" placeholder="misal: Jakarta Selatan" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="postal-code">Kode Pos</Label>
                  <Input id="postal-code" placeholder="12345" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Method for Physical Products */}
          {isPhysicalProduct && (
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Metode Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="gap-4">
                  {shippingOptions.map(option => (
                     <Label key={option.id} htmlFor={option.id} className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                        <div className="flex items-center gap-3">
                            <Truck className="h-6 w-6" />
                            <div>
                                <p className="font-semibold">{option.name}</p>
                                <p className="text-sm text-muted-foreground">Estimasi {option.estimation}</p>
                            </div>
                        </div>
                        <span className="font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(option.price)}</span>
                     </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> Metode Pembayaran</CardTitle>
              <CardDescription>
                Pembayaran akan dilakukan melalui transfer bank.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="border rounded-md p-4 flex items-center gap-3 bg-muted">
                    <Banknote className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">Pembayaran melalui akun virtual.</p>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Dengan mengklik "Lanjutkan ke Pembayaran", Anda akan diarahkan ke halaman detail pembayaran.
                </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={product.galleryImageUrls?.[0] || `https://picsum.photos/seed/${product.id}/56/37`}
                    alt={product.name}
                    width={56}
                    height={37}
                    className="rounded-md object-cover aspect-[3/2]"
                    data-ai-hint={product.galleryImageHints?.[0]}
                  />
                  <div>
                    <p className="font-medium text-sm leading-tight">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Oleh {creator?.name || '...'}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-sm">{formattedPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              {product.type === 'digital' && (
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (8%)</span>
                    <span>{formattedTax}</span>
                </div>
              )}
               {isPhysicalProduct && (
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pengiriman</span>
                    <span>{formattedShipping}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleProceedToPayment} disabled={userLoading || isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {userLoading ? 'Memuat...' : isProcessing ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
    
