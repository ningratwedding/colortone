import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const images = Object.fromEntries(PlaceHolderImages.map(image => [image.id, image]));

export type User = {
  id: string;
  name: string;
  avatar: ImagePlaceholder;
  bio: string;
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
  rating: number;
  reviewsCount: number;
};

export type Review = {
  id: string;
  user: User;
  rating: number;
  comment: string;
  date: string;
};

export const users: User[] = [
  { id: 'user-1', name: 'Elena Petrova', avatar: images['avatar-1'], bio: 'Landscape photographer and digital artist.' },
  { id: 'user-2', name: 'Marcus Chen', avatar: images['avatar-2'], bio: 'Urban explorer and filmmaker.' },
  { id: 'user-3', name: 'Aisha Khan', avatar: images['avatar-3'], bio: 'Portrait specialist and colorist.' },
  { id: 'user-4', name: 'John Doe', avatar: images['avatar-4'], bio: 'Aspiring photographer.' },
];

export const categories = [
    { id: 'cinematic', name: 'Cinematic' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'urban', name: 'Urban' },
    { id: 'minimal', name: 'Minimal' },
];

export const software = [
    { id: 'lightroom', name: 'Lightroom' },
    { id: 'photoshop', name: 'Photoshop' },
    { id: 'capture-one', name: 'Capture One' },
    { id: 'final-cut', name: 'Final Cut Pro' },
    { id: 'davinci-resolve', name: 'DaVinci Resolve' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Cinematic Teal & Orange',
    creator: users[0],
    price: 15.00,
    description: 'A pack of professional presets to give your photos a cinematic teal and orange look. Perfect for travel and urban photography.',
    imageBefore: images['product-1-before'],
    imageAfter: images['product-1-after'],
    category: categories[0],
    software: [software[0], software[1]],
    tags: ['cinematic', 'teal', 'orange', 'urban'],
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: '2',
    name: 'Moody Forest Greens',
    creator: users[1],
    price: 12.00,
    description: 'Enhance your forest and nature shots with these moody green presets. Adds depth and emotion to your landscapes.',
    imageBefore: images['product-2-before'],
    imageAfter: images['product-2-after'],
    category: categories[2],
    software: [software[0], software[2]],
    tags: ['moody', 'forest', 'nature', 'landscape'],
    rating: 4.9,
    reviewsCount: 98,
  },
  {
    id: '3',
    name: 'Golden Hour Glow',
    creator: users[2],
    price: 18.00,
    description: 'Capture the magic of golden hour with these warm, glowing presets. Ideal for portraits and beach photography.',
    imageBefore: images['product-3-before'],
    imageAfter: images['product-3-after'],
    category: categories[1],
    software: [software[0]],
    tags: ['golden hour', 'warm', 'portrait', 'beach'],
    rating: 4.7,
    reviewsCount: 210,
  },
  {
    id: '4',
    name: 'Urban Desaturated',
    creator: users[1],
    price: 10.00,
    description: 'A set of presets for a modern, desaturated urban look. Perfect for street style and architecture.',
    imageBefore: images['product-4-before'],
    imageAfter: images['product-4-after'],
    category: categories[4],
    software: [software[0], software[1], software[2]],
    tags: ['urban', 'desaturated', 'street', 'architecture'],
    rating: 4.6,
    reviewsCount: 75,
  },
  {
    id: '5',
    name: 'Pastel Dreams',
    creator: users[0],
    price: 14.00,
    description: 'Soft and dreamy pastel tones for a whimsical and airy feel. Great for fashion and lifestyle shots.',
    imageBefore: images['product-5-before'],
    imageAfter: images['product-5-after'],
    category: categories[1],
    software: [software[0]],
    tags: ['pastel', 'dreamy', 'soft', 'lifestyle'],
    rating: 4.8,
    reviewsCount: 150,
  },
  {
    id: '6',
    name: 'Vintage Film LUTs',
    creator: users[2],
    price: 25.00,
    description: 'A collection of LUTs that emulate the look of classic film stocks. Add a timeless, nostalgic feel to your videos.',
    imageBefore: images['product-6-before'],
    imageAfter: images['product-6-after'],
    category: categories[3],
    software: [software[3], software[4]],
    tags: ['vintage', 'film', 'lut', 'retro'],
    rating: 4.9,
    reviewsCount: 302,
  },
  {
    id: '7',
    name: 'Neon Nights',
    creator: users[1],
    price: 12.00,
    description: 'Vibrant presets that make neon colors pop. Perfect for night photography in the city.',
    imageBefore: images['product-7-before'],
    imageAfter: images['product-7-after'],
    category: categories[4],
    software: [software[0], software[1]],
    tags: ['neon', 'night', 'vibrant', 'city'],
    rating: 4.7,
    reviewsCount: 88,
  },
  {
    id: '8',
    name: 'Minimal White',
    creator: users[0],
    price: 10.00,
    description: 'Clean and bright presets for a minimalist aesthetic. Great for product and interior photography.',
    imageBefore: images['product-8-before'],
    imageAfter: images['product-8-after'],
    category: categories[5],
    software: [software[0], software[2]],
    tags: ['minimalist', 'white', 'bright', 'clean'],
    rating: 4.8,
    reviewsCount: 112,
  },
];

export const reviews: Review[] = [
    { id: 'review-1', user: users[3], rating: 5, comment: 'Absolutely transformed my travel photos! The cinematic look is stunning.', date: '2023-08-15' },
    { id: 'review-2', user: users[2], rating: 4, comment: 'Great presets for moody shots. A bit strong, so I usually dial it down a bit.', date: '2023-08-12' },
    { id: 'review-3', user: users[1], rating: 5, comment: 'My go-to for all my portrait work now. The skin tones are perfect.', date: '2023-08-10' },
];
