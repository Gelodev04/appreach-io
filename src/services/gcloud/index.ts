'use server';

import { Storage } from '@google-cloud/storage';
import { env } from 'src/data/env/server';

export const uploadFile = async (form: FormData) => {
  try {
    const file = form.get('file') as File;

    const buffer = await file.arrayBuffer();
    const storage = new Storage({
      projectId: env.G_PROJECT_ID,
      keyFilename: env.G_SERVICE_ACCOUNT_KEY,
    });

    const bucket = storage.bucket(process.env.G_BUCKET_NAME_EMAIL_VALIDATOR!);
    const gcsFile = bucket.file(file.name);

    await gcsFile.save(Buffer.from(buffer));

    // Make the file publicly accessible
    await gcsFile.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`;

    console.log({ url });
    return true;
  } catch (error) {
    console.error('Error on uploading file:', error);
    throw new Error(`Unable to upload file: ${error.message}`);
  }
};
