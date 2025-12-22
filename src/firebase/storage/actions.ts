// src/firebase/storage/actions.ts
'use client';

import { getSignedURL } from '@/lib/s3-actions';

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
 * Uploads a file to an S3-compatible service using a secure presigned URL flow.
 * The Firebase Storage instance is passed for compatibility but not used.
 * @param storage - Dummy Firebase Storage instance for compatibility.
 * @param file - The file to upload.
 * @param userId - The ID of the user uploading the file.
 * @param path - The base path (folder) for the upload (e.g., 'product_images').
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFile = async (
  storage: any, // Dummy parameter for compatibility
  file: File,
  userId: string,
  path: string
): Promise<string> => {
  if (!file || !userId) {
    throw new Error('File and userId are required for upload.');
  }

  let fileToUpload: Blob | File = file;
  let contentType = file.type;

  // Check if the file is an image and compress it
  if (file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file);
      contentType = 'image/jpeg';
    } catch (compressionError) {
      console.warn(
        'Image compression failed, uploading original file:',
        compressionError
      );
    }
  }

  try {
    // 1. Get a presigned URL from the server
    const res = await getSignedURL(
      userId,
      path,
      contentType,
      fileToUpload.size
    );

    if (res.failure) {
      throw new Error(`Failed to get signed URL: ${res.failure}`);
    }

    const { url, key } = res.success;
    const bucketUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.${process.env.NEXT_PUBLIC_S3_ENDPOINT?.replace('https://', '')}`;
    const publicUrl = `${bucketUrl}/${key}`;

    // 2. Upload the file to the presigned URL
    await fetch(url, {
      method: 'PUT',
      body: fileToUpload,
      headers: {
        'Content-Type': contentType,
      },
    });

    // 3. Return the public URL of the uploaded file
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed. Please try again.');
  }
};
