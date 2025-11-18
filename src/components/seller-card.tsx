
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface SellerCardProps {
  seller: UserProfile;
  className?: string;
}

export function SellerCard({ seller, className }: SellerCardProps) {
    const getRoleBadge = (role: UserProfile['role']) => {
        switch (role) {
            case 'kreator':
                return <Badge variant="secondary">Kreator</Badge>;
            case 'affiliator':
                return <Badge variant="outline">Afiliator</Badge>;
            default:
                return null;
        }
    };

    return (
        <Card className={cn("overflow-hidden group flex flex-col hover:shadow-lg transition-shadow duration-300", className)}>
            <CardHeader className="p-4 flex flex-row items-center gap-4">
                <Link href={`/${seller.slug}`} className="flex-shrink-0">
                    <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors duration-300">
                        <AvatarImage src={seller.avatarUrl} alt={seller.name} data-ai-hint={seller.avatarHint} />
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                 <div className="flex-1 overflow-hidden">
                    <Link href={`/${seller.slug}`}>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors duration-300">{seller.name}</h3>
                    </Link>
                    {getRoleBadge(seller.role)}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {seller.bio || `Lihat profil ${seller.name} untuk melihat produk unggulan.`}
                </p>
            </CardContent>
             <div className="p-4 pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/${seller.slug}`}>
                        Lihat Profil
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
