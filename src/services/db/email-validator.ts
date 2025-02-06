'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { CreateEmailValidatorPropType } from 'src/types/email-validator';
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
    throw new Error('Unable to get emails');
  }
};

export const createEmailValidator = async (data: CreateEmailValidatorPropType, file: string) => {
  try {
    await prisma.emailValidator.create({
      data: {
        hostId: data.hostId.value,
        hostName: data.hostId.label,
        upload: {
          listName: data.name,
          csvUpload: file,
        },
        status: 'ready',
      },
    });
  } catch (error) {
    return { error: `Unable to create email validator: ${error.message}` };
  }
};
