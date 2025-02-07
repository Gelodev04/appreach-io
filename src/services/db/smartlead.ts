'use server';

import { revalidatePath } from 'next/cache';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { paths } from 'src/routes/paths';
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
    throw new Error(`Unable to get smartlead`);
  }
};

export const deleteSmartleadById = async (id: string) => {
  try {
    await prisma.smartleadEmailAccounts.delete({
      where: { id },
    });

    revalidatePath(paths.smartlead.root);
  } catch (error) {
    console.log('Unable to delete', error);
    return {
      error: error.message,
    };
  }
};
