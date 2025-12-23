
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  type StorageReference,
} from 'firebase/storage';
import { useFirestore, useStorage } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Folder,
  File,
  Upload,
  PlusCircle,
  Loader2,
  Trash2,
  Copy,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface FileItem {
  name: string;
  url: string;
  size: number;
  updated: string;
  isFolder: false;
  ref: StorageReference;
}

interface FolderItem {
  name: string;
  isFolder: true;
  ref: StorageReference;
}

type StorageItem = FileItem | FolderItem;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function FileManagerClient() {
  const { user } = useUser();
  const storage = useStorage();
  const { toast } = useToast();

  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<StorageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Dialog states
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StorageItem | null>(null);

  // Form states
  const [folderName, setFolderName] = useState('');
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);

  const listFilesAndFolders = async (path: string) => {
    if (!user || !storage) return;
    setIsLoading(true);
    try {
      const listRef = ref(storage, `product_files/${user.uid}/${path}`);
      const res = await listAll(listRef);

      const folderPromises = res.prefixes.map(async (folderRef) => {
        return { name: folderRef.name, isFolder: true, ref: folderRef } as FolderItem;
      });

      const filePromises = res.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url,
          size: metadata.size,
          updated: metadata.updated,
          isFolder: false,
          ref: itemRef,
        } as FileItem;
      });
      
      const folders = await Promise.all(folderPromises);
      const files = await Promise.all(filePromises);
      
      setItems([...folders, ...files]);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal memuat file', description: 'Terjadi kesalahan saat mengambil data dari penyimpanan.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    if (user) {
      listFilesAndFolders(currentPath);
    }
  });

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    const crumbs = [{ name: 'Beranda', path: '' }];
    let current = '';
    for (const part of parts) {
      current += `${part}/`;
      crumbs.push({ name: part, path: current });
    }
    return crumbs;
  }, [currentPath]);

  const handleCreateFolder = async () => {
    if (!folderName || !user || !storage) return;
    const newFolderPath = `product_files/${user.uid}/${currentPath}${folderName}/.placeholder`;
    const folderRef = ref(storage, newFolderPath);

    try {
      await uploadBytes(folderRef, new Uint8Array());
      toast({ title: 'Folder Dibuat', description: `Folder "${folderName}" berhasil dibuat.` });
      setIsFolderDialogOpen(false);
      setFolderName('');
      listFilesAndFolders(currentPath);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal Membuat Folder' });
      console.error(error);
    }
  };
  
  const handleFileUpload = async () => {
    if (!filesToUpload || !user || !storage) return;
    setIsUploading(true);
    
    const uploadPromises = Array.from(filesToUpload).map(file => {
      const filePath = `product_files/${user.uid}/${currentPath}${file.name}`;
      const fileRef = ref(storage, filePath);
      return uploadBytes(fileRef, file);
    });

    try {
      await Promise.all(uploadPromises);
      toast({ title: 'Unggahan Berhasil', description: `${filesToUpload.length} file berhasil diunggah.` });
      setIsUploadDialogOpen(false);
      setFilesToUpload(null);
      listFilesAndFolders(currentPath);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal Mengunggah' });
      console.error(error);
    } finally {
        setIsUploading(false);
    }
  };

  const openDeleteDialog = (item: StorageItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.isFolder) {
        // This is a simplified delete. For non-empty folders, it would require recursive deletion.
        const placeholderRef = ref(itemToDelete.ref, '.placeholder');
        await deleteObject(placeholderRef);
      } else {
        await deleteObject(itemToDelete.ref);
      }
      toast({ title: 'Item Dihapus' });
      listFilesAndFolders(currentPath);
    } catch (error) {
       toast({ variant: 'destructive', title: 'Gagal Menghapus' });
       console.error(error);
    } finally {
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
    }
  };
  
  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Tautan disalin!' });
  };

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                <CardTitle>Manajer File</CardTitle>
                <CardDescription>Kelola file dan folder untuk produk digital Anda.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsFolderDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Buat Folder</Button>
                    <Button onClick={() => setIsUploadDialogOpen(true)}><Upload className="mr-2 h-4 w-4" />Unggah File</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.path}>
                            <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <button onClick={() => setCurrentPath(crumb.path)} className="hover:text-primary">{crumb.name}</button>
                                </BreadcrumbLink>
                            )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
                {isLoading ? (
                    <div className="text-center p-8"><Loader2 className="animate-spin mx-auto"/></div>
                ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead className="hidden md:table-cell">Terakhir Diubah</TableHead>
                        <TableHead className="text-right">Ukuran</TableHead>
                        <TableHead className="w-12"><span className="sr-only">Tindakan</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">Folder ini kosong.</TableCell></TableRow>
                        ) : items.map(item => (
                            <TableRow key={item.ref.fullPath}>
                                <TableCell className="font-medium">
                                    {item.isFolder ? (
                                        <button onClick={() => setCurrentPath(item.ref.fullPath.split('/').slice(2).join('/') + '/')} className="flex items-center gap-2 hover:text-primary">
                                            <Folder /> {item.name}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2"><File /> {item.name}</div>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{!item.isFolder && format(new Date(item.updated), 'd MMM yyyy, HH:mm', { locale: id })}</TableCell>
                                <TableCell className="text-right">{!item.isFolder && formatBytes(item.size)}</TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {!item.isFolder && <DropdownMenuItem onSelect={() => copyLink(item.url)}><Copy className="mr-2"/>Salin Tautan</DropdownMenuItem>}
                                            <DropdownMenuItem onSelect={() => openDeleteDialog(item)} className="text-destructive"><Trash2 className="mr-2"/>Hapus</DropdownMenuItem>
                                        </DropdownMenuContent>
                                     </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
        
        {/* Dialogs */}
        <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Buat Folder Baru</DialogTitle></DialogHeader>
                <div className="grid gap-2 py-4">
                    <Label htmlFor="folder-name">Nama Folder</Label>
                    <Input id="folder-name" value={folderName} onChange={e => setFolderName(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>Batal</Button>
                    <Button onClick={handleCreateFolder}>Buat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Unggah File</DialogTitle></DialogHeader>
                <div className="grid gap-2 py-4">
                    <Label htmlFor="file-upload">Pilih File</Label>
                    <Input id="file-upload" type="file" multiple onChange={(e) => setFilesToUpload(e.target.files)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>Batal</Button>
                    <Button onClick={handleFileUpload} disabled={isUploading || !filesToUpload}>
                        {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Mengunggah...</> : 'Unggah'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

         <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Item?</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus "{itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleDeleteItem}>Ya, Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
