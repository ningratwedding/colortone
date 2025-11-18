

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '@/firebase/provider';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import type { Order, Product, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id as fnsIdLocale } from 'date-fns/locale';

type SellerStat = {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarHint?: string;
  productCount: number;
  totalSales: number;
  totalRevenue: number;
}

export default function AnalyticsPage() {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!firestore) return;
      setLoading(true);

      try {
        const productsQuery = query(collection(firestore, 'products'));
        const ordersQuery = query(collectionGroup(firestore, 'orders'));
        const usersQuery = query(collection(firestore, 'users'));
        
        const [productsSnapshot, ordersSnapshot, usersSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(ordersQuery),
          getDocs(usersQuery),
        ]);

        const allProducts = productsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data() } as Product));
        const allOrders = ordersSnapshot.docs.map(doc => doc.data() as Order);
        const allUsers = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data() } as UserProfile));
        
        // Platform-wide stats
        const totalRevenue = allOrders.reduce((acc, order) => acc + order.amount, 0);
        const totalSales = allOrders.length;
        const totalProducts = allProducts.length;
        setStats({ totalRevenue, totalSales, totalProducts });
        
        // Monthly revenue processing
        const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
        const revenueByMonth = last6Months.map(monthDate => {
            const monthStart = startOfMonth(monthDate);
            const monthEnd = endOfMonth(monthDate);
            const monthlyRevenue = allOrders.reduce((acc, order) => {
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

        // Seller-specific stats
        const sellers = allUsers.filter(user => user.role === 'seller');
        const calculatedSellerStats = sellers.map(seller => {
          const sellerProducts = allProducts.filter(p => p.creatorId === seller.id);
          const sellerOrders = allOrders.filter(o => o.creatorId === seller.id);

          const productCount = sellerProducts.length;
          const sales = sellerOrders.length;
          const revenue = sellerOrders.reduce((acc, order) => acc + order.amount, 0);
          
          return {
            id: seller.id,
            name: seller.name,
            avatarUrl: seller.avatarUrl,
            avatarHint: seller.avatarHint,
            productCount: productCount,
            totalSales: sales,
            totalRevenue: revenue,
          };
        }).sort((a,b) => b.totalRevenue - a.totalRevenue); // Sort by revenue descending
        setSellerStats(calculatedSellerStats);

      } catch (error) {
        console.error("Error fetching platform analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [firestore]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };
  
  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(amount);
  };

  const formatTooltip = (amount: number) => {
    return formatCurrency(amount);
  };
  
  const formattedRevenue = formatCurrency(stats.totalRevenue);

  return (
    <div className="space-y-4">
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan (All-Time)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-48" /> : <div className="text-xl font-bold">{formattedRevenue}</div>}
            <p className="text-xs text-muted-foreground">
              Total pendapatan dari seluruh penjualan.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-7 w-24" /> : <div className="text-xl font-bold">{stats.totalSales.toLocaleString('id-ID')}</div>}
            <p className="text-xs text-muted-foreground">
              Jumlah total transaksi di platform.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-7 w-16" /> : <div className="text-xl font-bold">{stats.totalProducts.toLocaleString('id-ID')}</div>}
            <p className="text-xs text-muted-foreground">
              Jumlah produk yang terdaftar di marketplace.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendapatan Platform Bulanan</CardTitle>
          <CardDescription>
            Ringkasan penjualan seluruh platform selama 6 bulan terakhir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {loading ? (
                <Skeleton className="h-full w-full" />
            ) : (
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
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Pendapatan" />
                </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Papan Peringkat Penjual</CardTitle>
          <CardDescription>
            Kinerja penjualan untuk setiap penjual di platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penjual</TableHead>
                <TableHead className="text-center">Jumlah Produk</TableHead>
                <TableHead className="text-right">Total Penjualan</TableHead>
                <TableHead className="text-right">Total Pendapatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-24" /></div></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sellerStats.length > 0 ? (
                sellerStats.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={seller.avatarUrl} data-ai-hint={seller.avatarHint} />
                          <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{seller.productCount}</TableCell>
                    <TableCell className="text-right">{seller.totalSales.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(seller.totalRevenue)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Belum ada data penjual untuk ditampilkan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
