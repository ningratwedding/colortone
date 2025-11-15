
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Package } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'Selesai':
            return <Badge variant="default" className="bg-green-600 hover:bg-green-500">Selesai</Badge>;
        case 'Menunggu Pembayaran':
             return <Badge variant="secondary">Menunggu</Badge>;
        case 'Diproses':
            return <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-400">Diproses</Badge>;
        case 'Dibatalkan':
            return <Badge variant="destructive">Dibatalkan</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};


function PurchaseItem({ order }: { order: Order }) {
    const firestore = useFirestore();

    const productRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'products', order.productId);
    }, [firestore, order.productId]);

    // Use useDoc to get product details, especially the image
    const { data: product, loading: productLoading } = useDoc<Product>(productRef);

    const handleDownload = () => {
        if (!product || !product.downloadUrl) return;
        const link = document.createElement('a');
        link.href = product.downloadUrl;
        link.download = `${product.name.replace(/\s+/g, '-')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const isDigital = product?.type === 'digital';

    return (
        <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-3"
        >
            <div className="flex items-center gap-4 flex-1">
                {productLoading ? (
                     <Skeleton className="w-[72px] h-[48px] rounded-md" />
                ) : product?.galleryImageUrls?.[0] ? (
                    <Image
                        src={product.galleryImageUrls[0]}
                        alt={order.productName}
                        width={72}
                        height={48}
                        className="rounded-md object-cover bg-muted"
                        data-ai-hint={product.galleryImageHints?.[0]}
                    />
                ) : (
                    <div className="w-[72px] h-[48px] bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
                <div className="flex-1">
                    <Link href={`/product/${order.productId}`} className="hover:underline">
                        <p className="font-semibold leading-tight">{order.productName}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                       ID: {order.id}
                    </p>
                </div>
            </div>
             <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 self-stretch">
                <div className="flex-grow flex items-center justify-end sm:justify-center">
                     {getStatusBadge(order.status)}
                </div>
                {isDigital && order.status === 'Selesai' && (
                    <Button onClick={handleDownload} size="sm" className="sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                    </Button>
                )}
            </div>
        </div>
    );
}

function OrderList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
             <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada pesanan dengan status ini.</p>
            </div>
        )
    }
    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <PurchaseItem key={order.id} order={order} />
            ))}
        </div>
    )
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

    const filteredOrders = useMemo(() => {
        if (!orders) return { semua: [], diproses: [], selesai: [], dibatalkan: [] };
        return {
            semua: orders,
            diproses: orders.filter(o => o.status === 'Diproses' || o.status === 'Menunggu Pembayaran'),
            selesai: orders.filter(o => o.status === 'Selesai'),
            dibatalkan: orders.filter(o => o.status === 'Dibatalkan'),
        }
    }, [orders]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Riwayat Pembelian</CardTitle>
                <CardDescription>Lihat semua produk yang pernah Anda beli.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="semua" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                        <TabsTrigger value="semua">Semua</TabsTrigger>
                        <TabsTrigger value="diproses">Diproses</TabsTrigger>
                        <TabsTrigger value="selesai">Selesai</TabsTrigger>
                        <TabsTrigger value="dibatalkan">Dibatalkan</TabsTrigger>
                    </TabsList>
                    <div className="mt-4">
                        {loading ? (
                             <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg border p-3 gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Skeleton className="h-[48px] w-[72px] rounded-md" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-9 w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                           <>
                            <TabsContent value="semua">
                                <OrderList orders={filteredOrders.semua} />
                            </TabsContent>
                            <TabsContent value="diproses">
                                <OrderList orders={filteredOrders.diproses} />
                            </TabsContent>
                            <TabsContent value="selesai">
                               <OrderList orders={filteredOrders.selesai} />
                            </TabsContent>
                             <TabsContent value="dibatalkan">
                               <OrderList orders={filteredOrders.dibatalkan} />
                            </TabsContent>
                           </>
                        )}
                        {!loading && (!orders || orders.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Anda belum melakukan pembelian.</p>
                                <Button asChild variant="link" className="mt-2">
                                    <Link href="/products">Mulai Belanja</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
