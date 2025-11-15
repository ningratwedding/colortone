
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
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInDays, format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminBillingPage() {
  const firestore = useFirestore();

  const proUsersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('plan', '==', 'pro'));
  }, [firestore]);

  const { data: proUsers, loading } = useCollection<UserProfile>(proUsersQuery);

  const formatDate = (timestamp?: Timestamp | { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return 'N/A';
    let date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp && typeof timestamp.seconds === 'number') {
      date = new Date(timestamp.seconds * 1000);
    } else {
      return 'Tanggal tidak valid';
    }
    return format(date, 'd MMMM yyyy', { locale: id });
  };
  
  const getExpiryStatus = (expiryDate?: Timestamp | { seconds: number; nanoseconds: number }) => {
    if (!expiryDate) return { text: 'Tidak diatur', variant: 'secondary' as const };
    let date;
     if (expiryDate instanceof Timestamp) {
      date = expiryDate.toDate();
    } else {
      date = new Date(expiryDate.seconds * 1000);
    }

    const daysLeft = differenceInDays(date, new Date());

    if (daysLeft < 0) {
      return { text: 'Telah Kedaluwarsa', variant: 'destructive' as const };
    }
    if (daysLeft <= 7) {
      return { text: `Sisa ${daysLeft} hari`, variant: 'destructive' as const };
    }
    if (daysLeft <= 30) {
       return { text: `Sisa ${daysLeft} hari`, variant: 'default' as const };
    }
     return { text: `Aktif`, variant: 'default' as const };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Penagihan Akun Pro</CardTitle>
          <CardDescription>
            Lacak dan kelola semua pengguna yang berlangganan paket Pro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Tanggal Kedaluwarsa</TableHead>
                <TableHead>Status Langganan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : proUsers && proUsers.length > 0 ? (
                proUsers.map((user) => {
                  const expiryStatus = getExpiryStatus(user.planExpiryDate);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="font-medium">{formatDate(user.planExpiryDate)}</TableCell>
                      <TableCell>
                        <Badge variant={expiryStatus.variant}>{expiryStatus.text}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Belum ada pengguna Pro.
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
