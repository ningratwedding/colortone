
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { collection, query, where, getDocs, collectionGroup, documentId } from 'firebase/firestore';
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
  
  const [creatorProducts, setCreatorProducts] = useState<Product[]>([]);
  const [allCreatorOrders, setAllCreatorOrders] = useState<Order[]>([]);


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
        const productsQuery = query(collection(firestore, 'products'), where('creatorId', '==', user.uid));
        const allOrdersQuery = query(collectionGroup(firestore, 'orders'), where('creatorId', '==', user.uid));
        
        const [productsSnapshot, allOrdersSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(allOrdersQuery),
        ]);
        
        const fetchedCreatorProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setCreatorProducts(fetchedCreatorProducts);

        const fetchedCreatorOrders = allOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setAllCreatorOrders(fetchedCreatorOrders);

        // Calculate stats
        const totalRevenue = fetchedCreatorOrders.reduce((acc, order) => acc + order.amount, 0);
        const totalSales = fetchedCreatorOrders.length;
        const totalProducts = fetchedCreatorProducts.length;
        setStats({ totalRevenue, totalSales, totalProducts });

        // Process monthly revenue for the chart
        const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
        const revenueByMonth = last6Months.map(monthDate => {
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          const monthlyRevenue = fetchedCreatorOrders.reduce((acc, order) => {
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
        setLoading(false);

        // Process recent orders (can be derived from all orders)
        const sortedOrders = [...fetchedCreatorOrders].sort((a,b) => b.purchaseDate.seconds - a.purchaseDate.seconds);
        const fetchedRecentOrders = sortedOrders.slice(0, 5);
        setRecentOrders(fetchedRecentOrders);

        if (fetchedRecentOrders.length > 0) {
          const customerIds = [...new Set(fetchedRecentOrders.map(o => o.userId))];
          if(customerIds.length > 0) {
            const customersQuery = query(collection(firestore, 'users'), where(documentId(), 'in', customerIds));
            const customersSnapshot = await getDocs(customersQuery);
            const customersData: Record<string, UserProfile> = {};
            customersSnapshot.forEach(doc => {
              customersData[doc.id] = {id: doc.id, ...doc.data()} as UserProfile;
            });
            setCustomers(customersData);
          }
        }
        setOrdersLoading(false);

      } catch (error) {
        console.error("Error fetching creator dashboard data:", error);
        setLoading(false);
        setOrdersLoading(false);
      }
    };

    if (user && firestore) {
      fetchData();
    }
  }, [user, firestore]);
  
    const topProducts = useMemo(() => {
    if (!creatorProducts) return [];
    // The sales data is not on the product doc in this structure, we need to calculate it.
    const salesByProduct = allCreatorOrders.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productsWithSales = creatorProducts.map(p => ({
      ...p,
      sales: salesByProduct[p.id] || 0,
      revenue: (salesByProduct[p.id] || 0) * p.price,
    }));

    return productsWithSales.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [creatorProducts, allCreatorOrders]);
  
  const salesCompositionData = useMemo(() => {
    if (!creatorProducts || creatorProducts.length === 0) return [];

    const salesByProduct = allCreatorOrders.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productsWithSales = creatorProducts.map(p => ({
      name: p.name,
      sales: salesByProduct[p.id] || 0,
    }));

    const sortedBySales = productsWithSales.sort((a, b) => b.sales - a.sales);
    const top4 = sortedBySales.slice(0, 4);
    const otherSales = sortedBySales.slice(4).reduce((acc, p) => acc + p.sales, 0);

    const data = top4.map(p => ({ name: p.name, value: p.sales }));
    if (otherSales > 0) {
      data.push({ name: 'Lainnya', value: otherSales });
    }
    return data.filter(d => d.value > 0);

  }, [creatorProducts, allCreatorOrders]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <div className="lg:col-span-3 space-y-4 order-last lg:order-first">
        <Card>
            <div className="relative z-10 flex flex-col">
            <CardHeader>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Saldo
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {pageLoading ? <Skeleton className="h-7 w-32" /> : <div className="text-2xl font-bold">{formattedBalance}</div>}
                <p className="text-xs text-muted-foreground">
                Saldo yang tersedia untuk ditarik.
                </p>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full"
                    onClick={handleWithdraw}
                    disabled={pageLoading}
                >
                    Tarik Dana
                </Button>
            </CardFooter>
            </div>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
              <div>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                  <CardDescription>5 pesanan terakhir Anda.</CardDescription>
              </div>
              <Button asChild variant="link" className=" -mt-2 -mr-4">
                  <Link href="/creator/orders">
                      Lihat Semua
                  </Link>
              </Button>
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
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <Card className="flex flex-col">
           <CardHeader>
            <CardTitle>Ringkasan Pendapatan</CardTitle>
            <CardDescription>
              Ringkasan penjualan dan produk Anda selama 6 bulan terakhir.
            </CardDescription>
            
             <div className="hidden md:grid md:grid-cols-3 pt-4">
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pendapatan</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-40" /> : <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>}
                </div>
                
                <div className="p-4 border-l space-y-1">
                   <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Penjualan</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('id-ID')}</div>}
                </div>

                 <div className="p-4 border-l space-y-1">
                   <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Produk Aktif</h3>
                  </div>
                  {pageLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.totalProducts}</div>}
                </div>
              </div>
          </CardHeader>
          <CardContent className="flex-grow">
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
                    {pageLoading ? Array.from({length:3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        </TableRow>
                    )) :
                    topProducts.length > 0 ?
                    topProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.sales}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                    </TableRow>
                    )) : (
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
                {pageLoading ? <Skeleton className="h-[250px] w-full" /> : 
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
    </div>
  );
}

