
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

function PurchaseItem({ order }: { order: Order }) {
    const firestore = useFirestore();
    const productRef = useMemo(() => {
      if (!firestore) return null;
      return doc(firestore, 'products', order.productId);
    }, [firestore, order.productId]);
    
    // We need to use `getDoc` here instead of `useDoc` because this component is in a loop.
    // Using `useDoc` in a loop can cause issues.
    // For simplicity in this refactor, we will just show the product name from the order.
    // A more robust solution would fetch product details separately or denormalize data.

    return (
        <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-4"
        >
            <div className="flex items-center gap-4">
                {/* We don't have the image URL in the order object, so we show a placeholder */}
                <div className="w-[84px] h-[56px] bg-muted rounded-md flex items-center justify-center">
                    <Download className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <Link href={`/product/${order.productId}`} className="hover:underline">
                        <p className="font-semibold">{order.productName}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                       ID Pesanan: {order.id}
                    </p>
                </div>
            </div>
            <Button asChild className="w-full sm:w-auto">
                <Link href={`/checkout/confirmation?productId=${order.productId}`}>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh
                </Link>
            </Button>
        </div>
    );
}


export default function PurchasesPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const ordersQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `users/${user.uid}/orders`), orderBy('purchaseDate', 'desc'));
    }, [firestore, user]);

    const { data: orders, loading: ordersLoading } = useCollection<Order>(ordersQuery);

    const loading = userLoading || ordersLoading;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Riwayat Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading && (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border p-3 gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <Skeleton className="h-[56px] w-[84px] rounded-md" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-28" />
                            </div>
                        ))}
                    </div>
                )}
                {!loading && orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                           <PurchaseItem key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Anda belum melakukan pembelian.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/">Mulai Belanja</Link>
                            </Button>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}
