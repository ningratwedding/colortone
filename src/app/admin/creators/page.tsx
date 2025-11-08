
"use client";

import Image from "next/image";
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
import { users } from "@/lib/data";

export default function AdminCreatorsPage() {
  const [allCreators] = useState(users);

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
                    {/* Placeholder value */}
                    {Math.floor(Math.random() * 10) + 1}
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
                        <DropdownMenuItem>Nonaktifkan Kreator</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
