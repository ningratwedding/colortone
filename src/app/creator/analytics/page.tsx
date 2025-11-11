
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const monthlyRevenueData = [
  { month: 'Jan', revenue: 4000000 },
  { month: 'Feb', revenue: 3000000 },
  { month: 'Mar', revenue: 5000000 },
  { month: 'Apr', revenue: 4500000 },
  { month: 'May', revenue: 6000000 },
  { month: 'Jun', revenue: 5500000 },
];


export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'products'), where('creatorId', '==', user.uid));
  }, [user, firestore]);
  
  const { data: creatorProducts, loading: productsLoading } = useCollection<Product>(productsQuery);

  const [formattedStats, setFormattedStats] = useState({
    totalRevenue: '',
    totalSales: '0',
  });
  
  const topProducts = useMemo(() => {
    if (!creatorProducts) return [];
    // Sort on the client side
    const sortedProducts = [...creatorProducts].sort((a, b) => b.sales - a.sales);
    return sortedProducts.slice(0, 5).map(p => ({
      ...p,
      revenue: p.price * p.sales,
    }));
  }, [creatorProducts]);
  
  const salesCompositionData = useMemo(() => {
    if (!creatorProducts || creatorProducts.length === 0) return [];
    const sortedBySales = [...creatorProducts].sort((a, b) => b.sales - a.sales);
    const top4 = sortedBySales.slice(0, 4);
    const otherSales = sortedBySales.slice(4).reduce((acc, p) => acc + p.sales, 0);

    const data = top4.map(p => ({ name: p.name, value: p.sales }));
    if (otherSales > 0) {
      data.push({ name: 'Lainnya', value: otherSales });
    }
    return data;

  }, [creatorProducts]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];


  useEffect(() => {
     const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    if (creatorProducts) {
        const totalRevenue = creatorProducts.reduce((acc, p) => acc + (p.price * p.sales), 0);
        const totalSales = creatorProducts.reduce((acc, p) => acc + p.sales, 0);

        setFormattedStats(prev => ({ 
            ...prev, 
            totalRevenue: formatCurrency(totalRevenue),
            totalSales: totalSales.toLocaleString('id-ID'),
        }));
    } else {
        setFormattedStats(prev => ({
            ...prev,
            totalRevenue: formatCurrency(0),
            totalSales: '0',
        }))
    }
  }, [creatorProducts]);

  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(amount);
  }

  const formatTooltip = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }
  
  const loading = userLoading || productsLoading;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan (All-Time)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formattedStats.totalRevenue}</div>}
            <p className="text-xs text-muted-foreground">
              Berdasarkan semua penjualan Anda.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">+{formattedStats.totalSales}</div>}
             <p className="text-xs text-muted-foreground">
              Total unit terjual dari semua produk.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grafik Pendapatan</CardTitle>
          <CardDescription>
            Pendapatan Anda selama 6 bulan terakhir (data placeholder).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCompact(value as number)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
                formatter={(value) => formatTooltip(value as number)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Pendapatan"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>
              Produk dengan pendapatan tertinggi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Penjualan</TableHead>
                  <TableHead className="text-right">Pendapatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({length:3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))}
                {!loading && topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                    <TableCell className="text-right">{formatTooltip(product.revenue)}</TableCell>
                  </TableRow>
                ))}
                 {!loading && topProducts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">Anda belum memiliki penjualan.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Penjualan</CardTitle>
             <CardDescription>
              Distribusi penjualan di antara produk Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? <Skeleton className="h-[250px] w-full" /> : 
             salesCompositionData.length > 0 ? (
             <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={salesCompositionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {salesCompositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} penjualan`, name]}/>
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                    Data tidak tersedia.
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
