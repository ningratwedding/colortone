
'use client';

import Link from "next/link";
import { SlidersHorizontal, Eye, EyeOff } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';

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
import { signInWithGoogle, signInWithEmail } from "@/firebase/auth/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UserProfile } from "@/lib/data";
import { useFirestore } from "@/firebase/provider";
import { Logo } from "@/components/logo";


const formSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi tidak boleh kosong."),
});

type FormData = z.infer<typeof formSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const firestore = useFirestore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleRedirect = (profile: UserProfile) => {
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }
    switch (profile.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'kreator':
        router.push('/creator/dashboard');
        break;
      case 'affiliator':
        router.push('/account/affiliate');
        break;
      case 'pembeli':
      default:
        router.push('/account');
        break;
    }
  };

  const getOrCreateUserProfile = async (user: User): Promise<UserProfile> => {
    if (!firestore) {
      throw new Error("Firestore is not initialized");
    }
    const userRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    } else {
      const name = user.displayName || 'Pengguna Baru';
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      // Check if slug already exists
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('slug', '==', slug), limit(1));
      const slugSnapshot = await getDocs(q);
      if (!slugSnapshot.empty) {
        throw new Error(`Nama pengguna "${name}" sudah digunakan. Silakan gunakan nama lain.`);
      }

      const newUserProfileData = {
        name: name,
        email: user.email!,
        slug: slug,
        role: 'pembeli' as const,
        plan: 'free' as const,
        createdAt: serverTimestamp(),
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        avatarHint: 'user avatar'
      };
      await setDoc(userRef, newUserProfileData);
      const newDocSnap = await getDoc(userRef);
      return { id: newDocSnap.id, ...newDocSnap.data() } as UserProfile;
    }
  };


  const handleGoogleSignIn = async () => {
    form.clearErrors();
    const result = await signInWithGoogle();
    if (result.success && result.user) {
      try {
        const profile = await getOrCreateUserProfile(result.user);
        toast({ title: "Masuk Berhasil", description: "Selamat datang kembali!" });
        handleRedirect(profile);
      } catch(e) {
        const errorMessage = e instanceof Error ? e.message : "Tidak dapat mengambil atau membuat profil pengguna.";
         toast({
          variant: "destructive",
          title: "Gagal Membuat Profil",
          description: errorMessage,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: result.error,
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await signInWithEmail(data.email, data.password);
    if (result.success && result.profile) {
      toast({ title: "Masuk Berhasil", description: "Selamat datang kembali!" });
      handleRedirect(result.profile);
    } else {
       toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: result.error,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center space-x-2 mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center text-primary">
                  <Logo className="h-8 w-auto text-primary" />
                  <span className="font-bold text-2xl ml-2">TokoKita</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl">Selamat Datang Kembali</CardTitle>
          <CardDescription>
            Masuk untuk mengelola toko dan produk UMKM Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
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
                    <div className="flex items-center">
                      <FormLabel>Kata Sandi</FormLabel>
                       <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Lupa kata sandi Anda?
                        </Link>
                    </div>
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
                 {form.formState.isSubmitting ? "Memproses..." : "Masuk"}
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
            <GoogleIcon className="mr-2 h-4 w-4" />
            Masuk dengan Google
          </Button>

          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/signup" className="underline">
              Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
