
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import Link from "next/link";

export default function ProfilePage() {
    const user = users[0];

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">Profil Saya</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profil Publik</CardTitle>
                      <CardDescription>
                          Informasi ini akan ditampilkan secara publik.
                      </CardDescription>
                    </div>
                    <Link href={`/creator/${user.id}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                      Lihat Profil Saya
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar.imageUrl} data-ai-hint={user.avatar.imageHint} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex gap-2">
                            <Button>Ubah Foto</Button>
                            <Button variant="outline">Hapus</Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            defaultValue={user.bio}
                            placeholder="Ceritakan sedikit tentang diri Anda"
                            className="min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Simpan Perubahan</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-8">
        </div>
      </div>
    </div>
  );
}
