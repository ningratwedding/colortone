
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';
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
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import type { Order, Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id as fnsIdLocale } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

      try {
        // Fetch creator's products and all orders in parallel
        const productsQuery = query(collection(firestore, 'products'), where('creatorId', '==', user.uid));
        // Fetch all orders and filter on the client. This avoids the index error while the index is being created.
        const ordersQuery = query(collectionGroup(firestore, 'orders'));
        
        const [productsSnapshot, ordersSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(ordersQuery),
        ]);

        const creatorProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        // Filter orders on the client side
        const creatorOrders = ordersSnapshot.docs.map(doc => doc.data() as Order).filter(order => order.creatorId === user.uid);


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

      } catch (error) {
        console.error("Error fetching creator dashboard data:", error);
      } finally {
        setLoading(false);
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="md:order-last lg:col-span-1 order-first relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pageLoading ? <Skeleton className="h-7 w-40" /> : <div className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</div>}
            <p className="text-xs text-muted-foreground">Total pendapatan dari seluruh penjualan.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penjualan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pageLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-xl font-bold">{stats.totalSales.toLocaleString('id-ID')}</div>}
            <p className="text-xs text-muted-foreground">Jumlah total unit produk terjual.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pageLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-xl font-bold">{stats.totalProducts}</div>}
            <p className="text-xs text-muted-foreground">Jumlah produk yang Anda jual.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pendapatan Bulanan</CardTitle>
          <CardDescription>Ringkasan penjualan Anda selama 6 bulan terakhir.</CardDescription>
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
    </div>
  );
}
