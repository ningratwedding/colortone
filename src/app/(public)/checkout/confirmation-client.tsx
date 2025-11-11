
'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import type { Product, Order } from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Copy, Clock, Loader2, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const bankDetails = {
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8880123456',
    accountHolder: 'PT Colortone Kreatif Digital',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function ConfirmationClient() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const affiliateRefId = searchParams.get('ref');
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [timeLeft, setTimeLeft] = useState('24:00:00');
    
    const productRef = useMemo(() => {
        if (!firestore || !productId) return null;
        return doc(firestore, 'products', productId);
    }, [firestore, productId]);
    
    const { data: product, loading: productLoading } = useDoc<Product>(productRef);

    useEffect(() => {
        if (product && user && !order && !isCreatingOrder) {
            const createOrder = async () => {
                setIsCreatingOrder(true);
                try {
                    const totalAmount = product.price * 1.08; // price + 8% tax
                    
                    const orderData: any = {
                        userId: user.uid,
                        productId: product.id,
                        productName: product.name,
                        creatorId: product.creatorId,
                        purchaseDate: serverTimestamp(),
                        amount: totalAmount,
                        status: 'Menunggu Pembayaran' as const,
                    };
                    
                    // Prioritize ref from URL, fallback to session storage
                    const refId = affiliateRefId || sessionStorage.getItem('affiliate_ref');
                    if (refId && refId !== user.uid) { // Prevent self-referral
                        orderData.affiliateId = refId;
                    }
                    // Clear session storage after using it
                    if (sessionStorage.getItem('affiliate_ref')) {
                        sessionStorage.removeItem('affiliate_ref');
                    }
                    
                    const orderRef = await addDoc(collection(firestore, `users/${user.uid}/orders`), orderData);
                    setOrder({ ...orderData, id: orderRef.id, purchaseDate: { seconds: Date.now() / 1000, nanoseconds: 0 } });
                    
                } catch (error) {
                    console.error("Error creating order:", error);
                    toast({
                        variant: 'destructive',
                        title: 'Gagal Membuat Pesanan',
                        description: 'Terjadi kesalahan saat membuat pesanan Anda. Silakan coba lagi.',
                    });
                } finally {
                    setIsCreatingOrder(false);
                }
            };
            createOrder();
        }
    }, [product, user, order, isCreatingOrder, firestore, toast, affiliateRefId]);

    useEffect(() => {
        if (!order?.purchaseDate) return;

        const interval = setInterval(() => {
            const purchaseTime = new Date(order.purchaseDate.seconds * 1000).getTime();
            const now = new Date().getTime();
            const distance = purchaseTime + (24 * 60 * 60 * 1000) - now;

            if (distance < 0) {
                setTimeLeft('Waktu Habis');
                clearInterval(interval);
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [order]);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Disalin!', description: `${text} telah disalin ke clipboard.` });
    };
    
    if (productLoading || userLoading || isCreatingOrder) {
        return (
            <div className="flex flex-col items-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="items-center text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <CardTitle className="mt-4">Membuat Pesanan Anda...</CardTitle>
                        <CardDescription>Mohon tunggu sebentar.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (!product || !order) {
        return (
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Kesalahan!</AlertTitle>
                <AlertDescription>
                    Tidak dapat memuat detail pesanan. Pastikan Anda telah masuk dan produk valid.
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center text-center">
                    <Clock className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-2xl">Menunggu Pembayaran</CardTitle>
                    <CardDescription>
                        Selesaikan pembayaran dalam <span className="font-bold text-primary">{timeLeft}</span> untuk menyelesaikan pesanan Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-card p-4 space-y-3">
                        <p className="text-sm font-medium text-center">Silakan transfer ke rekening berikut:</p>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Bank</span>
                                <span className="font-semibold">{bankDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Nama Penerima</span>
                                <span className="font-semibold">{bankDetails.accountHolder}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Nomor Rekening</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{bankDetails.accountNumber}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(bankDetails.accountNumber)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                     <div className="rounded-lg border bg-card p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total Pembayaran</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-primary">{formatCurrency(order.amount)}</span>
                                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(String(Math.floor(order.amount)))}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-1">Penting: Pastikan Anda mentransfer jumlah yang sama persis untuk verifikasi otomatis.</p>
                     </div>

                     <Button className="w-full" asChild>
                        <Link href={`/checkout/confirmation/download?orderId=${order.id}&productId=${product.id}`}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Saya Sudah Transfer
                        </Link>
                     </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/account/purchases">Lihat Riwayat Pesanan</Link>
                      </Button>
                </CardContent>
            </Card>
        </div>
    );
}
