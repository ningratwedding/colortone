
"use client";

import Image from "next/image";
import { MoreHorizontal, UserPlus } from "lucide-react";
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
import { users, type User } from "@/lib/data";

type UserWithRole = User & { role: 'Kreator' | 'Pembeli' };

const allUsers: UserWithRole[] = users.map(user => ({
    ...user,
    role: ['user-1', 'user-2', 'user-3'].includes(user.id) ? 'Kreator' : 'Pembeli'
}));


export default function AdminUsersPage() {
  const [userList, setUserList] = useState<UserWithRole[]>(allUsers);

  const handleRoleChange = (userId: string, newRole: 'Kreator') => {
    setUserList(currentUsers => 
        currentUsers.map(user => 
            user.id === userId ? {...user, role: newRole } : user
        )
    );
  };

  const getRoleBadge = (role: 'Kreator' | 'Pembeli') => {
    switch (role) {
      case 'Kreator':
        return <Badge variant="secondary">Kreator</Badge>;
      case 'Pembeli':
        return <Badge variant="outline">Pembeli</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pengguna</CardTitle>
          <CardDescription>
            Lihat dan kelola semua pengguna di platform.
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
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Tindakan</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar>
                        <AvatarImage src={user.avatar.imageUrl} data-ai-hint={user.avatar.imageHint} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
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
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alihkan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        {user.role === 'Kreator' && (
                            <DropdownMenuItem asChild>
                                <Link href={`/creator/${user.slug}`}>Lihat Profil Kreator</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                         {user.role === 'Pembeli' && (
                            <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'Kreator')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Jadikan Kreator
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">Nonaktifkan Pengguna</DropdownMenuItem>
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
