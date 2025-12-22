
// src/lib/s3.ts

import { S3Client } from '@aws-sdk/client-s3';

const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const region = process.env.NEXT_PUBLIC_S3_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

export const getS3Client = () => {
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    console.error("S3 credentials are not fully set in .env.local");
    return null;
  }

  return new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
};
