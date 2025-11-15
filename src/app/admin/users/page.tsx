

"use client";

import { MoreHorizontal, UserPlus, UserMinus, UserCheck, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy, doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { UserProfile } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addMonths } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminUsersPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const usersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
    }, [firestore]);

    const { data: userList, loading } = useCollection<UserProfile>(usersQuery);

    const handleRoleChange = async (userId: string, newRole: 'kreator' | 'pembeli' | 'affiliator') => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { role: newRole });
            toast({ title: "Peran Diperbarui", description: `Pengguna sekarang adalah seorang ${newRole}.` });
        } catch (error) {
            console.error("Error updating role:", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Tidak dapat mengubah peran pengguna." });
        }
    };
    
    const handlePlanChange = async (userId: string, currentPlan: 'free' | 'pro') => {
        if (!firestore) return;
        const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
        const userDocRef = doc(firestore, 'users', userId);
        try {
            const updateData: any = { plan: newPlan };
            if (newPlan === 'pro') {
                updateData.planExpiryDate = addMonths(new Date(), 1);
            } else {
                updateData.planExpiryDate = null;
            }
            await updateDoc(userDocRef, updateData);
            toast({ title: "Paket Diperbarui", description: `Pengguna sekarang berada di paket ${newPlan}.` });
        } catch (error) {
            console.error("Error updating plan:", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Tidak dapat mengubah paket pengguna." });
        }
    };
    
    const handleDateChange = async (userId: string, date: Date | undefined) => {
        if (!firestore || !date) return;
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { planExpiryDate: date });
            toast({ title: "Tanggal Kedaluwarsa Diperbarui" });
        } catch (error) {
            console.error("Error updating expiry date:", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui Tanggal" });
        }
    };


    const getRoleBadge = (role: UserProfile['role']) => {
        switch (role) {
        case 'kreator':
            return <Badge variant="secondary">Kreator</Badge>;
        case 'pembeli':
            return <Badge variant="outline">Pembeli</Badge>;
        case 'admin':
            return <Badge>Admin</Badge>;
        case 'affiliator':
            return <Badge variant="destructive">Affiliator</Badge>;
        default:
            return <Badge variant="outline">{String(role)}</Badge>;
        }
    };

    const formatDate = (timestamp?: Timestamp | { seconds: number; nanoseconds: number; }) => {
        if (!timestamp) return 'N/A';
        let date;
        if (timestamp instanceof Timestamp) {
            date = timestamp.toDate();
        } else if (timestamp && typeof timestamp.seconds === 'number') {
            date = new Date(timestamp.seconds * 1000);
        } else {
            return 'Tanggal tidak valid';
        }
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pengguna</CardTitle>
          <CardDescription>
            Lihat dan kelola semua pengguna di platform. Anda dapat mengubah peran dan paket langganan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[80px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead className="hidden lg:table-cell">Kedaluwarsa Pro</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
              {!loading && userList && userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                   <TableCell>
                    {getRoleBadge(user.role)}
                   </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                             <Switch
                                id={`plan-switch-${user.id}`}
                                checked={user.plan === 'pro'}
                                onCheckedChange={() => handlePlanChange(user.id, user.plan)}
                                disabled={user.role === 'admin'}
                            />
                            <Badge variant={user.plan === 'pro' ? 'default' : 'outline'}>
                                {user.plan === 'pro' ? 'Pro' : 'Free'}
                            </Badge>
                        </div>
                   </TableCell>
                   <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {user.plan === 'pro' ? (
                       <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                size="sm"
                                className={cn(
                                    "w-[150px] justify-start text-left font-normal",
                                    !user.planExpiryDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {user.planExpiryDate ? formatDate(user.planExpiryDate) : 'Atur Tanggal'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={user.planExpiryDate ? (user.planExpiryDate as Timestamp).toDate() : undefined}
                                onSelect={(date) => handleDateChange(user.id, date)}
                                initialFocus
                            />
                        </PopoverContent>
                       </Popover>
                    ) : 'N/A'}
                   </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          disabled={user.role === 'admin'}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alihkan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ubah Peran</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role !== 'pembeli' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'pembeli')}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Jadikan Pembeli
                            </DropdownMenuItem>
                        )}
                        {user.role !== 'kreator' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'kreator')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Jadikan Kreator
                            </DropdownMenuItem>
                        )}
                        {user.role !== 'affiliator' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'affiliator')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Jadikan Affiliator
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.role === 'kreator' && (
                            <DropdownMenuItem asChild>
                                <Link href={`/creator/${user.slug}`}>Lihat Profil Kreator</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Nonaktifkan Pengguna</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            {!loading && (!userList || userList.length === 0) && (
              <div className="text-center p-8 text-muted-foreground">
                  Tidak ada pengguna yang ditemukan.
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
