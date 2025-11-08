
"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
} from "@/components/ui/alert-dialog"
import { users, products, type User } from "@/lib/data";

type CreatorRevenue = {
    id: string;
    revenue: number;
    formattedRevenue: string;
};

export default function AdminCreatorsPage() {
  const [allCreators] = useState(users);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [creatorRevenues, setCreatorRevenues] = useState<Record<string, CreatorRevenue>>({});
  const [selectedCreator, setSelectedCreator] = useState<User | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  useEffect(() => {
    const counts: Record<string, number> = {};
    const revenues: Record<string, CreatorRevenue> = {};

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    users.forEach(creator => {
      const creatorProducts = products.filter(p => p.creator.id === creator.id);
      counts[creator.id] = creatorProducts.length;
      
      const totalRevenue = creatorProducts.reduce((acc, product) => acc + (product.price * product.sales), 0);
      revenues[creator.id] = {
        id: creator.id,
        revenue: totalRevenue,
        formattedRevenue: formatCurrency(totalRevenue)
      };
    });

    setProductCounts(counts);
    setCreatorRevenues(revenues);
  }, []);

  const handleDeactivateClick = (creator: User) => {
    setSelectedCreator(creator);
    setIsDeactivateDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Kreator</CardTitle>
          <CardDescription>
            Lihat dan kelola semua kreator di platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[80px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Nama Kreator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jumlah Produk</TableHead>
                <TableHead>Pendapatan</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCreators.map((creator) => (
                <TableRow key={creator.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar>
                        <AvatarImage src={creator.avatar.imageUrl} data-ai-hint={creator.avatar.imageHint} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{creator.name}</TableCell>
                   <TableCell>
                    <Badge variant="outline">Aktif</Badge>
                  </TableCell>
                  <TableCell>
                    {productCounts[creator.id] || 0}
                  </TableCell>
                  <TableCell className="font-medium">
                    {creatorRevenues[creator.id]?.formattedRevenue}
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
                            <Link href={`/creator/${creator.slug}`}>Lihat Profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeactivateClick(creator)}>Nonaktifkan Kreator</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menonaktifkan kreator <span className="font-semibold">{selectedCreator?.name}</span>. Mereka tidak akan dapat mengakses dasbor kreator mereka.
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
