'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { getUserSettings } from './user-settings';

export const getSmartleadsByHostIds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const smartlead = await prisma.smartleadEmailAccounts.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
    });

    return smartlead;
  } catch (error) {
    console.error('Error on getting smartlead:', error); // Log the actual error
    throw new Error(`Unable to get smartlead: ${error.message}`);
  }
};
