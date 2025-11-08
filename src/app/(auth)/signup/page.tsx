
'use client';

import Link from "next/link";
import { SlidersHorizontal, Eye, EyeOff } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signUpWithEmail } from "@/firebase/auth/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap harus terdiri dari minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

type FormData = z.infer<typeof formSchema>;


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    form.clearErrors();
    const result = await signInWithGoogle();
    if (result.success) {
      toast({ title: "Pendaftaran Berhasil", description: "Selamat datang di Colortone!" });
      router.push("/account");
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: result.error,
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await signUpWithEmail(data.email, data.password, data.fullName);
    if (result.success) {
      toast({ title: "Pendaftaran Berhasil", description: "Selamat datang di Colortone! Silakan periksa email Anda untuk verifikasi." });
      router.push("/account");
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: result.error,
      });
    }
  };


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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Anda" {...field} disabled={form.formState.isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="pr-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={form.formState.isSubmitting}
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? "Membuat akun..." : "Buat sebuah akun"}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={form.formState.isSubmitting}>
            Daftar dengan Google
          </Button>

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
