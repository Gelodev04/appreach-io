'use server';

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
