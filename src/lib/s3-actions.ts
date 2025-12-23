// src/lib/s3-actions.ts
'use server';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION!,
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;

/**
 * Creates a presigned URL for uploading a file to S3.
 * This function runs only on the server.
 * @param userId - The ID of the user uploading the file.
 * @param path - The base path for the upload (e.g., 'avatars').
 * @param fileType - The MIME type of the file.
 * @param fileSize - The size of the file in bytes.
 * @returns A promise that resolves with the presigned URL and the final object key.
 */
export async function getSignedURL(
  userId: string,
  path: string,
  fileType: string,
  fileSize: number
) {
  if (!process.env.NEXT_PUBLIC_S3_REGION || !process.env.NEXT_PUBLIC_S3_ENDPOINT || !process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
    return { failure: 'Konfigurasi S3 tidak lengkap. Harap periksa file .env.local Anda.' };
  }

  if (!userId || !path || !fileType || !fileSize) {
    return { failure: 'Input tidak valid untuk mendapatkan signed URL.' };
  }
  
  // Enforce file size limit (e.g., 10MB)
  if (fileSize > 10 * 1024 * 1024) {
    return { failure: 'Ukuran file melebihi batas 10MB.' };
  }

  const fileExtension = fileType.split('/')[1] || 'bin';
  const key = `${path}/${userId}/${uuidv4()}.${fileExtension}`;

  const putCommand = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ACL: 'public-read',
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 60, // URL expires in 60 seconds
    });
    return { success: { url: signedUrl, key } };
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return { failure: 'Gagal membuat signed URL. Pastikan kredensial S3 Anda benar.' };
  }
}

/**
 * Deletes a file from the S3 bucket.
 * This function runs only on the server.
 * @param key - The key of the object to delete.
 * @returns A promise that resolves with a success or failure message.
 */
export async function deleteFile(key: string) {
  if (!key) {
    return { failure: 'File key is required.' };
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket,
    Key: key,
  });

  try {
    await s3Client.send(deleteCommand);
    return { success: 'File deleted successfully.' };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { failure: 'Failed to delete file.' };
  }
}
