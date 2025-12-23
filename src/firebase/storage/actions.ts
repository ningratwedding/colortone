// src/firebase/storage/actions.ts
'use client';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Compresses an image file before upload.
 * @param file The image file to compress.
 * @param maxSize The maximum width or height of the image.
 * @returns A promise that resolves with the compressed image as a Blob.
 */
const compressImage = (file: File, maxSize = 1920): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up object URL
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas to Blob conversion failed'));
          }
          resolve(blob);
        },
        'image/jpeg',
        0.8 // 80% quality
      );
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      reject(error);
    };
  });
};

/**
 * Uploads a file to Firebase Storage.
 * @param storage - The Firebase Storage instance.
 * @param file - The file to upload.
 * @param userId - The ID of the user uploading the file.
 * @param path - The base path (folder) for the upload (e.g., 'product_images').
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFile = async (
  storage: FirebaseStorage,
  file: File,
  userId: string,
  path: string
): Promise<string> => {
  if (!file || !userId || !storage) {
    throw new Error('Storage, file, and userId are required for upload.');
  }

  let fileToUpload: Blob | File = file;
  let fileExtension = file.name.split('.').pop() || 'bin';

  // Check if the file is an image and compress it
  if (file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file);
      fileExtension = 'jpg';
    } catch (compressionError) {
      console.warn(
        'Image compression failed, uploading original file:',
        compressionError
      );
    }
  }

  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${path}/${userId}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, fileToUpload);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error during file upload process:', error);
    throw new Error('File upload failed. Please try again.');
  }
};
