'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { uploadFile } from '@/firebase/storage/actions';
import { Loader2, UploadCloud, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function TestStoragePage() {
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadURL(null); // Reset URL on new file selection
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'Tidak ada file dipilih', description: 'Silakan pilih file untuk diunggah.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Anda harus login', description: 'Silakan login untuk menguji unggahan.' });
      return;
    }

    setIsUploading(true);
    setDownloadURL(null);

    try {
      const url = await uploadFile(file, user.uid, 'test-uploads');
      setDownloadURL(url);
      toast({
        title: 'Unggah Berhasil!',
        description: 'File Anda telah berhasil diunggah ke Firebase Storage.',
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.';
      toast({
        variant: 'destructive',
        title: 'Gagal Mengunggah',
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (userLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tes Firebase Storage</CardTitle>
          <CardDescription>
            Halaman ini digunakan untuk memverifikasi fungsionalitas unggah file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center text-muted-foreground p-4 border rounded-md">
                <p>Anda harus login untuk bisa mengunggah file.</p>
                 <Button asChild variant="link">
                    <Link href="/login?redirect=/test-storage">Login di sini</Link>
                </Button>
            </div>
          ) : (
            <>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="file-upload">Pilih File</Label>
                <Input id="file-upload" type="file" ref={fileInputRef} onChange={handleFileChange} />
                {file && <p className="text-sm text-muted-foreground">File dipilih: {file.name}</p>}
              </div>

              <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Unggah File
                  </>
                )}
              </Button>
            </>
          )}

          {downloadURL && (
            <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-medium flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    URL Hasil Unggahan:
                </h3>
                <div className="p-2 bg-muted rounded-md text-xs break-all">
                    <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {downloadURL}
                    </a>
                </div>
                 <p className="text-xs text-muted-foreground">Klik tautan di atas untuk memverifikasi file.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
