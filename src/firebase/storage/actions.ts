
'use client';

import { getS3Client } from '@/lib/s3';
import { Upload } from '@aws-sdk/lib-storage';
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
 * Uploads a file to an S3-compatible service, with automatic image compression.
 * @param s3Client - The S3 client instance.
 * @param file - The file to upload.
 * @param userId - The ID of the user uploading the file.
 * @param path - The base path (folder) for the upload (e.g., 'product_images').
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFile = async (
  storage: any, // s3Client will be passed here, but we use a dummy 'storage' arg to keep function signature
  file: File,
  userId: string,
  path: string
): Promise<string> => {
  const s3Client = getS3Client();

  if (!s3Client) {
    throw new Error('S3 client is not configured. Check environment variables.');
  }
  
  if (!file || !userId) {
    throw new Error('File and userId are required for upload.');
  }

  let fileToUpload: Blob | File = file;
  let fileName = file.name;
  let contentType = file.type;

  // Check if the file is an image and compress it
  if (file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file);
      fileName = `${uuidv4()}.jpg`; // Always use .jpg for compressed images
      contentType = 'image/jpeg';
    } catch (compressionError) {
      console.warn(
        'Image compression failed, uploading original file:',
        compressionError
      );
      const fileExtension = file.name.split('.').pop();
      fileName = `${uuidv4()}.${fileExtension}`;
    }
  } else {
    const fileExtension = file.name.split('.').pop();
    fileName = `${uuidv4()}.${fileExtension}`;
  }
  
  const Key = `${path}/${userId}/${fileName}`;
  const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

  if (!Bucket) {
    throw new Error('S3 bucket name is not configured in .env.local.');
  }

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: fileToUpload,
        ACL: 'public-read',
        ContentType: contentType,
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional part size configuration
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    await parallelUploads3.done();

    // Construct the public URL
    const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
    if (!endpoint) {
        throw new Error('S3_ENDPOINT is not defined for URL construction.');
    }
    
    // Check if the endpoint already includes the bucket name (subdomain style)
    if (endpoint.includes(Bucket)) {
        return `${endpoint}/${Key}`;
    }
    
    return `${endpoint}/${Bucket}/${Key}`;

  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('File upload failed. Please try again.');
  }
};
