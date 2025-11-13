
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/provider";
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import type { Order, Product, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id as fnsIdLocale } from 'date-fns/locale';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  
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
        
        const totalRevenue = allOrders.reduce((acc, order) => acc + order.amount, 0);
        const totalSales = allOrders.length;
        const totalProducts = allProducts.length;
        const totalUsers = allUsers.length;
        setStats({ totalRevenue, totalSales, totalProducts, totalUsers });
        
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

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
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

  return (
    <div className="space-y-2 md:space-y-4">
      
      <div className="grid gap-2 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-48" /> : <div className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</div>}
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
              Jumlah produk yang terdaftar.
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-7 w-16" /> : <div className="text-xl font-bold">{stats.totalUsers.toLocaleString('id-ID')}</div>}
            <p className="text-xs text-muted-foreground">
              Jumlah pengguna terdaftar.
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
    </div>
  );
}
