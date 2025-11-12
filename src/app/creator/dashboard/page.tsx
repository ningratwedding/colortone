
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, ArrowUpRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { collection, query, where, getDocs, collectionGroup, limit as firestoreLimit } from 'firebase/firestore';
import type { Order, Product, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id as fnsIdLocale } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Record<string, UserProfile>>({});
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [formattedBalance, setFormattedBalance] = useState('');

  useEffect(() => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };
    // Placeholder balance, replace with actual data when available
    setFormattedBalance(formatCurrency(2500000));
  }, []);

  const handleWithdraw = () => {
    toast({
        title: "Permintaan Penarikan Diterima",
        description: "Tim kami akan menghubungi Anda melalui email dalam 1-2 hari kerja untuk memproses penarikan dana Anda. Terima kasih!",
        duration: 8000,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!firestore || !user) return;
      setLoading(true);
      setOrdersLoading(true);

      try {
        // Fetch creator's products and all orders in parallel
        const productsQuery = query(collection(firestore, 'products'), where('creatorId', '==', user.uid));
        
        const allOrdersQuery = query(collectionGroup(firestore, 'orders'), where('creatorId', '==', user.uid));
        
        const [productsSnapshot, allOrdersSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(allOrdersQuery),
        ]);
        
        const recentOrdersQuery = query(collectionGroup(firestore, 'orders'), where('creatorId', '==', user.uid), firestoreLimit(5));
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);


        const creatorProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const creatorOrders = allOrdersSnapshot.docs.map(doc => doc.data() as Order);

        // Calculate stats
        const totalRevenue = creatorOrders.reduce((acc, order) => acc + order.amount, 0);
        const totalSales = creatorOrders.length;
        const totalProducts = creatorProducts.length;
        setStats({ totalRevenue, totalSales, totalProducts });

        // Process monthly revenue for the chart
        const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
        const revenueByMonth = last6Months.map(monthDate => {
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          const monthlyRevenue = creatorOrders.reduce((acc, order) => {
            const purchaseDate = new Date(order.purchaseDate.seconds * 1000);
            if (isWithinInterval(purchaseDate, { start: monthStart, end: monthEnd })) {
              return acc + order.amount;
            }
            return acc;
          }, 0);
          return {
            month: format(monthDate, 'MMM', { locale: fnsIdLocale }),
            revenue: monthlyRevenue,
          };
        });
        setMonthlyRevenueData(revenueByMonth);

        // Process recent orders
        const fetchedRecentOrders = recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        // Sort on the client side
        fetchedRecentOrders.sort((a, b) => b.purchaseDate.seconds - a.purchaseDate.seconds);
        setRecentOrders(fetchedRecentOrders);

        if (fetchedRecentOrders.length > 0) {
          const customerIds = [...new Set(fetchedRecentOrders.map(o => o.userId))];
          if(customerIds.length > 0) {
            // Firestore 'in' queries are limited to 30 elements.
            // We'll assume for recent orders this is fine. For a larger scale app, chunking would be needed.
            const customersQuery = query(collection(firestore, 'users'), where('__name__', 'in', customerIds));
            const customersSnapshot = await getDocs(customersQuery);
            const customersData: Record<string, UserProfile> = {};
            customersSnapshot.forEach(doc => {
              customersData[doc.id] = {id: doc.id, ...doc.data()} as UserProfile;
            });
            setCustomers(customersData);
          }
        }

      } catch (error) {
        console.error("Error fetching creator dashboard data:", error);
      } finally {
        setLoading(false);
        setOrdersLoading(false);
      }
    };

    if (user && firestore) {
      fetchData();
    }
  }, [user, firestore]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };
  
  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(amount);
  };

  const formatTooltip = (amount: number) => {
    return formatCurrency(amount);
  };
  
  const pageLoading = userLoading || loading;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'Selesai':
            return <Badge className="bg-green-600 hover:bg-green-700">Selesai</Badge>;
        case 'Menunggu Pembayaran':
             return <Badge variant="secondary">Menunggu Pembayaran</Badge>;
        case 'Diproses':
            return <Badge variant="secondary">Diproses</Badge>;
        case 'Dibatalkan':
            return <Badge variant="destructive">Dibatalkan</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        <div className="order-first md:order-last md:col-span-1">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground h-full">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-foreground/10" />
                <div className="absolute top-16 -left-12 w-40 h-40 rounded-full bg-primary-foreground/5" />
                <div className="relative z-10 h-full flex flex-col">
                <CardHeader>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-primary-foreground/80">
                        Total Saldo
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary-foreground/80" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    {pageLoading ? <Skeleton className="h-7 w-32 bg-white/20" /> : <div className="text-xl font-bold">{formattedBalance}</div>}
                    <p className="text-xs text-primary-foreground/80">
                    Saldo yang tersedia untuk ditarik.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        onClick={handleWithdraw}
                        disabled={pageLoading}
                    >
                        Tarik Dana
                    </Button>
                </CardFooter>
                </div>
            </Card>
        </div>

      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
           <CardHeader>
            <CardTitle>Ringkasan Pendapatan</CardTitle>
            <CardDescription>
              Ringkasan penjualan dan produk Anda selama 6 bulan terakhir.
            </CardDescription>
             {/* Desktop View - Single Card with 3 stats */}
             <div className="hidden md:grid md:grid-cols-3 pt-4">
                {/* Total Pendapatan */}
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pendapatan</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-40" /> : <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>}
                </div>
                
                {/* Penjualan */}
                <div className="p-4 border-l space-y-1">
                   <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Penjualan</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('id-ID')}</div>}
                </div>

                {/* Produk Aktif */}
                 <div className="p-4 border-l space-y-1">
                   <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Produk Aktif</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.totalProducts}</div>}
                </div>
              </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {pageLoading ? <Skeleton className="h-full w-full" /> : (
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCompact(value as number)} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                    }}
                    formatter={(value) => formatTooltip(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Pendapatan" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>5 pesanan terakhir yang Anda terima.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden h-8 w-8 sm:flex">
                            <AvatarImage src={customers[order.userId]?.avatarUrl} alt="Avatar" />
                            <AvatarFallback>{customers[order.userId]?.name?.charAt(0) || 'P'}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium truncate">{customers[order.userId]?.name || 'Pelanggan'}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Belum ada pesanan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter>
            <Button className="w-full" asChild>
                <Link href="/creator/orders">
                    Lihat Semua Pesanan
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
            </Button>
           </CardFooter>
        </Card>
      </div>

    </div>
  );
}

