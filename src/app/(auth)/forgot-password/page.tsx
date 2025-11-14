
'use client';

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { sendPasswordReset } from "@/firebase/auth/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Logo } from "@/components/logo";

const formSchema = z.object({
  email: z.string().email("Format email tidak valid."),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await sendPasswordReset(data.email);
    if (result.success) {
      toast({
        title: "Email Terkirim",
        description: "Silakan periksa kotak masuk Anda untuk tautan pemulihan kata sandi.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim Email",
        description: result.error,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <CardTitle className="text-2xl">Lupa Kata Sandi?</CardTitle>
          <CardDescription>
            Tidak masalah. Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Mengirim..." : "Kirim Tautan Pemulihan"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Ingat kata sandi Anda?{" "}
            <Link href="/login" className="underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
