'use server';

import { Storage } from '@google-cloud/storage';
import { env } from 'src/data/env/server';

export const uploadFile = async (form: FormData, type?: string) => {
  try {
    const file = form.get('file') as File;

    const jsonString = atob(env.G_SERVICE_ACCOUNT_KEY!);
    const credentials = JSON.parse(jsonString);

    const buffer = await file.arrayBuffer();
    const storage = new Storage({
      projectId: env.G_PROJECT_ID,
      credentials,
    });

    const bucket = storage.bucket(
      type === 'email'
        ? process.env.G_BUCKET_NAME_EMAIL_VALIDATOR!
        : process.env.G_BUCKET_NAME_ATTRIBUTE_UPLOADS!
    );
    const gcsFile = bucket.file(file.name);

    await gcsFile.save(Buffer.from(buffer));

    // Make the file publicly accessible
    await gcsFile.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`;

    return { url };
  } catch (error) {
    console.error('Error on uploading file:', error);
    return { error: 'Error on uploading file.' };
  }
};

export const getSignedUrl = async (fileName: string, type?: string) => {
  try {
    const jsonString = atob(env.G_SERVICE_ACCOUNT_KEY!);
    const credentials = JSON.parse(jsonString);

    const storage = new Storage({
      projectId: env.G_PROJECT_ID,
      credentials,
    });

    const [url] = await storage
      .bucket(
        type === 'email'
          ? process.env.G_BUCKET_NAME_EMAIL_VALIDATOR!
          : process.env.G_BUCKET_NAME_ATTRIBUTE_UPLOADS!
      )
      .file(fileName)
      .getSignedUrl({
        action: 'write',
        version: 'v4',
        expires: Date.now() + 15 * 60 * 1000,
        contentType: 'application/octet-stream',
      });

    return { url };
  } catch (error) {
    console.error('Error on uploading file:', error);
    return { error: 'Error on getting signed url.' };
  }
};

export const finalizeUpload = async (fileName: string, type?: string) => {
  try {
    const jsonString = atob(env.G_SERVICE_ACCOUNT_KEY!);
    const credentials = JSON.parse(jsonString);

    const storage = new Storage({
      projectId: env.G_PROJECT_ID,
      credentials,
    });

    const bucket = storage.bucket(
      type === 'email'
        ? process.env.G_BUCKET_NAME_EMAIL_VALIDATOR!
        : process.env.G_BUCKET_NAME_ATTRIBUTE_UPLOADS!
    );
    const gcsFile = bucket.file(fileName);

    await gcsFile.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`;

    return { url };
  } catch (error) {
    console.error('Error on uploading file:', error);
    return { error: 'Error on uploading file.' };
  }
};
