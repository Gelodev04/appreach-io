'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { getUserSettings } from './user-settings';

export const getAttributesUploadsByHostIds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const attributes = await prisma.attributeUploads.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
    });

    return attributes;
  } catch (error) {
    console.error('Error on getting attributes:', error); // Log the actual error
    throw new Error(`Unable to get attributes: ${error.message}`);
  }
};
