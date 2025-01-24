'use server';

import { Storage } from '@google-cloud/storage';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { getUserSettings } from './user-settings';

export const getEmailValidatorByHostIds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const emails = await prisma.emailValidator.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
    });

    return emails;
  } catch (error) {
    console.error('Error on getting emails:', error); // Log the actual error
    throw new Error(`Unable to get emails: ${error.message}`);
  }
};

export const UploadFile = async (form: FormData) => {
  try {
    const file = form.get('file') as File;

    const buffer = await file.arrayBuffer();
    const storage = new Storage();
    const testFile = await storage
      .bucket('email-validator-dev')
      .file(file.name)
      .save(Buffer.from(buffer));

    console.log({ testFile });
    return true;
  } catch (error) {
    console.error('Error on uploading file:', error);
    throw new Error(`Unable to upload file: ${error.message}`);
  }
};
