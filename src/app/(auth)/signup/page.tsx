
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <SlidersHorizontal className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">Colortone</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Mulai Kisah Anda</CardTitle>
          <CardDescription>
            Bergabunglah dengan komunitas para pencerita visual. Buat, bagikan, dan inspirasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nama Lengkap</Label>
              <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Buat sebuah akun
            </Button>
            <Button variant="outline" className="w-full">
              Daftar dengan Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline">
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
