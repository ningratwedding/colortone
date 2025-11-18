

"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { UserProfile } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSellersPage() {
  const firestore = useFirestore();
  const sellersQuery = query(collection(firestore, "users"), where("role", "==", "seller"));
  const { data: allSellers, loading } = useCollection<UserProfile>(sellersQuery);
  
  const [selectedSeller, setSelectedSeller] = useState<UserProfile | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  // Note: Product counts and revenues would require more complex queries or data duplication.
  // For this refactoring, we will show placeholders or 'N/A' for these fields.

  const handleDeactivateClick = (seller: UserProfile) => {
    setSelectedSeller(seller);
    setIsDeactivateDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Penjual</CardTitle>
          <CardDescription>
            Lihat dan kelola semua penjual di platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[80px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Nama Penjual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jumlah Produk</TableHead>
                <TableHead>Pendapatan</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
              {!loading && allSellers && allSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar>
                        <AvatarImage src={seller.avatarUrl} data-ai-hint={seller.avatarHint} />
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{seller.name}</TableCell>
                   <TableCell>
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell>
                    N/A
                  </TableCell>
                  <TableCell className="font-medium">
                    N/A
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alihkan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/${seller.slug}`}>Lihat Profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeactivateClick(seller)}>Nonaktifkan Penjual</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!loading && (!allSellers || allSellers.length === 0) && (
              <div className="text-center p-8 text-muted-foreground">
                  Tidak ada penjual yang ditemukan.
              </div>
           )}
        </CardContent>
      </Card>

       <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menonaktifkan penjual <span className="font-semibold">{selectedSeller?.name}</span>. Mereka tidak akan dapat mengakses dasbor penjual mereka.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => { /* Logika penonaktifan di sini */ setIsDeactivateDialogOpen(false); }}>
              Ya, Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
