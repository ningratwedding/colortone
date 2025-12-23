
import type { Metadata } from 'next';
import FileManagerClient from './file-manager-client';

export const metadata: Metadata = {
  title: 'Manajer File',
  description: 'Kelola file dan folder untuk produk digital Anda.',
};

export default function FileManagerPage() {
  return <FileManagerClient />;
}
