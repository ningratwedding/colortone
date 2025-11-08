
"use client";

import { MoreHorizontal, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
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
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { UserProfile } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const usersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "users"), orderBy("name"));
    }, [firestore]);

    const { data: userList, loading } = useCollection<UserProfile>(usersQuery);

    const handleRoleChange = async (userId: string, newRole: 'kreator' | 'pembeli') => {
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { role: newRole });
            toast({ title: "Peran Diperbarui", description: `Pengguna sekarang adalah seorang ${newRole}.` });
        } catch (error) {
            console.error("Error updating role:", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Tidak dapat mengubah peran pengguna." });
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
        default:
            return <Badge variant="outline">{String(role)}</Badge>;
        }
    };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pengguna</CardTitle>
          <CardDescription>
            Lihat dan kelola semua pengguna di platform. Anda dapat mengubah peran antara 'Pembeli' dan 'Kreator'.
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
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
              {!loading && userList && userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar>
                        <AvatarImage src={user.avatarUrl} data-ai-hint={user.avatarHint} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                   <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                   <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
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
                        <DropdownMenuLabel>Tindakan Pengguna</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role === 'kreator' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'pembeli')}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Jadikan Pembeli
                            </DropdownMenuItem>
                        )}
                        {user.role === 'pembeli' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'kreator')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Jadikan Kreator
                            </DropdownMenuItem>
                        )}
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
