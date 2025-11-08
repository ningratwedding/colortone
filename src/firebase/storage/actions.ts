
'use client';

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { useStorage } from '@/firebase/provider';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Firebase Storage.
 * @param storage - The Firebase Storage instance.
 * @param file - The file to upload.
 * @param userId - The ID of the user uploading the file.
 * @param path - The base path for the upload (e.g., 'product_images').
 * @returns A promise that resolves with the download URL of the uploaded file.
 */
export const uploadFile = async (
  storage: ReturnType<typeof useStorage>,
  file: File,
  userId: string,
  path: string
): Promise<string> => {
  if (!file || !userId) {
    throw new Error('File and userId are required for upload.');
  }

  const fileId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${fileId}.${fileExtension}`;
  const storageRef = ref(storage, `${path}/${userId}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed. Please try again.');
  }
};
