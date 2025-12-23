
'use client';

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { signInWithGoogle, signUpWithEmail } from "@/firebase/auth/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UserProfile } from "@/lib/data";
import { useFirestore } from "@/firebase/provider";
import { Logo } from "@/components/logo";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/config";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

const formSchema = z.object({
  profileName: z.string().min(3, "Url Profile harus terdiri dari minimal 3 karakter.").regex(/^[a-z0-9-]+$/, "Url Profile hanya boleh berisi huruf kecil, angka, dan tanda hubung."),
  fullName: z.string().min(3, "Nama lengkap harus diisi."),
  email: z.string().email("Format email tidak valid."),
  phoneNumber: z.string().min(10, "Nomor telepon tidak valid.").max(15, "Nomor telepon tidak valid."),
  bio: z.string().min(10, "Bio minimal 10 karakter.").max(160, "Bio maksimal 160 karakter."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
  confirmPassword: z.string().min(6, "Kata sandi minimal 6 karakter."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok.",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function SignupPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('slug') || "";
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const firestore = useFirestore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileName: initialSlug,
      fullName: "",
      email: "",
      phoneNumber: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRedirect = (profile: UserProfile) => {
    // New users are always 'pembeli', so we redirect them to the account page.
    router.push('/account');
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
      let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      // Check if slug already exists and append a random suffix if it does
      const usersRef = collection(firestore, 'users');
      let slugExists = true;
      let attempts = 0;
      while (slugExists && attempts < 5) {
        const q = query(usersRef, where('slug', '==', slug), limit(1));
        const slugSnapshot = await getDocs(q);
        if (slugSnapshot.empty) {
          slugExists = false;
        } else {
          slug = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
          attempts++;
        }
      }
      
      if (slugExists) {
        throw new Error(`Gagal membuat nama pengguna unik untuk "${name}".`);
      }

      const newUserProfileData = {
        name: name,
        fullName: user.displayName || '',
        email: user.email!,
        slug: slug,
        role: 'pembeli' as const,
        plan: 'free' as const,
        createdAt: serverTimestamp(),
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        avatarHint: 'user avatar',
        phoneNumber: '',
        bio: '',
      };
      setDoc(userRef, newUserProfileData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'create',
                requestResourceData: newUserProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

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
        toast({ title: "Pendaftaran Berhasil", description: "Selamat datang di LinkStore!" });
        handleRedirect(profile);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Tidak dapat membuat profil pengguna baru.";
         toast({
          variant: "destructive",
          title: "Gagal Membuat Profil",
          description: errorMessage,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: result.error,
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await signUpWithEmail(data);
    if (result.success && result.profile) {
      toast({ title: "Pendaftaran Berhasil", description: "Selamat datang di LinkStore! Silakan periksa email Anda untuk verifikasi." });
      handleRedirect(result.profile);
    } else {
       if (result.error?.includes('sudah terdaftar')) {
        form.setError('email', { 
          type: 'manual', 
          message: 'Email ini sudah terdaftar.'
        }, {
          shouldFocus: true
        });
        toast({
            variant: "destructive",
            title: "Email Sudah Terdaftar",
            description: <>Anda sudah memiliki akun. Silakan <Link href="/login" className="underline font-bold">masuk di sini</Link>.</>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Gagal Mendaftar",
          description: result.error,
        });
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Link href="/">
              <Logo className="text-primary" />
            </Link>
          </div>
          <CardTitle className="text-2xl">Mulai Bisnis Online Anda</CardTitle>
          <CardDescription>
            Daftar untuk membuat halaman etalase digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {!initialSlug && (
                <FormField
                  control={form.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Url Profile</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="url-anda" 
                          {...field} 
                          disabled={form.formState.isSubmitting} 
                          onChange={(e) => {
                              // Convert to lowercase and remove invalid characters
                              const sanitizedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                              field.onChange(sanitizedValue);
                          }}
                        />
                      </FormControl>
                       <div className="text-sm rounded-md bg-muted p-2 text-muted-foreground flex items-center gap-2">
                        <Logo className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{new URL(siteConfig.url).hostname}/{form.watch('profileName') || '...'}</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               {initialSlug && (
                 <div className="text-sm rounded-md bg-muted p-3 text-muted-foreground">
                    URL Profil Publik Anda akan menjadi: <span className="font-semibold text-foreground">{siteConfig.url}/{initialSlug}</span>
                 </div>
               )}
               <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Siti Aminah" {...field} disabled={form.formState.isSubmitting} />
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
                        placeholder="alamat@email.com"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="081234567890" {...field} disabled={form.formState.isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio Singkat</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ceritakan sedikit tentang brand atau diri Anda..." {...field} disabled={form.formState.isSubmitting} />
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
                          placeholder="Minimal 6 karakter"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                     <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ketik ulang kata sandi Anda"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? "Membuat akun..." : "Buat Akun"}
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
