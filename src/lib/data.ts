
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const images = Object.fromEntries(PlaceHolderImages.map(image => [image.id, image]));

export type User = {
  id: string;
  name: string;
  avatar: ImagePlaceholder;
  bio: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
};

export type Product = {
  id: string;
  name: string;
  creator: User;
  price: number;
  description: string;
  imageBefore: ImagePlaceholder;
  imageAfter: ImagePlaceholder;
  category: { id: string; name: string };
  software: { id: string; name: string }[];
  tags: string[];
  sales: number;
  reviewsCount: number;
};

export const users: User[] = [
  { id: 'user-1', name: 'Kartika Sari', avatar: images['avatar-1'], bio: 'Fotografer lanskap dan seniman digital yang bersemangat, mengkhususkan diri dalam menangkap keindahan alam Indonesia yang belum terjamah.', socials: { instagram: 'kartikasari', facebook: 'kartikasari', tiktok: 'kartikasari' } },
  { id: 'user-2', name: 'Bagus Wijaya', avatar: images['avatar-2'], bio: 'Penjelajah kota dan pembuat film yang mendokumentasikan denyut nadi kota-kota di Asia Tenggara melalui lensa sinematik.', socials: { instagram: 'baguswijaya' } },
  { id: 'user-3', name: 'Dewi Lestari', avatar: images['avatar-3'], bio: 'Spesialis potret dan pewarna dengan hasrat untuk menghidupkan kisah-kisah manusia melalui warna-warna yang cerah dan otentik.', socials: { instagram: 'dewilestari' } },
  { id: 'user-4', name: 'Agus Santoso', avatar: images['avatar-4'], bio: 'Fotografer yang bercita-cita tinggi dengan fokus pada fotografi pernikahan adat dan modern.' },
];

export const categories = [
    { id: 'pernikahan', name: 'Pernikahan' },
    { id: 'pre-wedding', name: 'Pre-wedding' },
    { id: 'wisuda', name: 'Wisuda' },
    { id: 'studio', name: 'Foto Studio' },
    { id: 'keluarga', name: 'Keluarga' },
    { id: 'perjalanan', name: 'Perjalanan' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'makanan', name: 'Makanan' },
];

export const software = [
    { id: 'lightroom', name: 'Lightroom' },
    { id: 'lightroom-mobile', name: 'Lightroom Mobile'},
    { id: 'photoshop', name: 'Photoshop' },
    { id: 'capture-one', name: 'Capture One' },
    { id: 'premiere-pro', name: 'Premiere Pro' },
    { id: 'final-cut', name: 'Final Cut Pro' },
    { id: 'davinci-resolve', name: 'DaVinci Resolve' },
    { id: 'capcut', name: 'CapCut' },
    { id: 'vn-editor', name: 'VN Video Editor' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Teal & Orange Sinematik',
    creator: users[0],
    price: 150000,
    description: 'Satu pak preset profesional untuk memberikan foto Anda tampilan sinematik teal dan oranye. Sempurna untuk fotografi perjalanan dan perkotaan.',
    imageBefore: images['product-1-before'],
    imageAfter: images['product-1-after'],
    category: categories[5],
    software: [software[0], software[1], software[2]],
    tags: ['sinematik', 'teal', 'oranye', 'perkotaan'],
    sales: 1250,
    reviewsCount: 250,
  },
  {
    id: '2',
    name: 'Pernikahan Klasik',
    creator: users[1],
    price: 120000,
    description: 'Tingkatkan foto pernikahan Anda dengan preset klasik ini. Menambahkan kedalaman dan emosi pada hari istimewa Anda.',
    imageBefore: images['product-2-before'],
    imageAfter: images['product-2-after'],
    category: categories[0],
    software: [software[0], software[3]],
    tags: ['pernikahan', 'klasik', 'elegan', 'cinta'],
    sales: 890,
    reviewsCount: 178,
  },
  {
    id: '3',
    name: 'Cahaya Jam Emas',
    creator: users[2],
    price: 180000,
    description: 'Tangkap keajaiban jam emas dengan preset hangat dan bercahaya ini. Ideal untuk potret dan fotografi pre-wedding.',
    imageBefore: images['product-3-before'],
    imageAfter: images['product-3-after'],
    category: categories[1],
    software: [software[0]],
    tags: ['jam emas', 'hangat', 'potret', 'pre-wedding'],
    sales: 2100,
    reviewsCount: 420,
  },
  {
    id: '4',
    name: 'Toga Wisuda',
    creator: users[1],
    price: 100000,
    description: 'Satu set preset untuk menonjolkan detail dan warna pada foto wisuda Anda. Sempurna untuk momen kelulusan.',
    imageBefore: images['product-4-before'],
    imageAfter: images['product-4-after'],
    category: categories[2],
    software: [software[0], software[1], software[3]],
    tags: ['wisuda', 'kelulusan', 'potret', 'cerah'],
    sales: 540,
    reviewsCount: 108,
  },
  {
    id: '5',
    name: 'Mimpi Pastel',
    creator: users[0],
    price: 140000,
    description: 'Warna pastel yang lembut dan dreamy untuk nuansa aneh dan lapang. Bagus untuk foto keluarga dan anak-anak.',
    imageBefore: images['product-5-before'],
    imageAfter: images['product-5-after'],
    category: categories[4],
    software: [software[0]],
    tags: ['pastel', 'dreamy', 'lembut', 'keluarga'],
    sales: 780,
    reviewsCount: 156,
  },
  {
    id: '6',
    name: 'LUT Film Antik',
    creator: users[2],
    price: 250000,
    description: 'Kumpulan LUT yang meniru tampilan stok film klasik. Tambahkan nuansa abadi dan nostalgia ke video Anda.',
    imageBefore: images['product-6-before'],
    imageAfter: images['product-6-after'],
    category: categories[5],
    software: [software[4], software[5], software[6]],
    tags: ['antik', 'film', 'lut', 'retro'],
    sales: 450,
    reviewsCount: 90,
  },
  {
    id: '7',
    name: 'Studio Profesional',
    creator: users[1],
    price: 120000,
    description: 'Preset yang dirancang khusus untuk fotografi studio. Menghasilkan warna kulit yang akurat dan kontras yang tajam.',
    imageBefore: images['product-7-before'],
    imageAfter: images['product-7-after'],
    category: categories[3],
    software: [software[0], software[2]],
    tags: ['studio', 'potret', 'profesional', 'bersih'],
    sales: 1500,
    reviewsCount: 300,
  },
  {
    id: '8',
    name: 'Perjalanan Tropis',
    creator: users[0],
    price: 100000,
    description: 'Preset cerah dan jenuh untuk foto perjalanan Anda di daerah tropis. Membuat warna hijau dan biru menonjol.',
    imageBefore: images['product-8-before'],
    imageAfter: images['product-8-after'],
    category: categories[5],
    software: [software[0], software[3]],
    tags: ['perjalanan', 'tropis', 'cerah', 'pantai'],
    sales: 1800,
    reviewsCount: 360,
  },
];
