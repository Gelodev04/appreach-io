'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { paths } from 'src/routes/paths';
import { getHostById } from './hosts';
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

export const syncSmartleadAccounts = async (id: string) => {
  const { smartlead } = await getHostById(id, { smartlead: true });

  if (!smartlead?.apiKey) {
    throw new Error('API key is missing');
  }

  const response = await axios.get(
    `https://server.smartlead.ai/api/v1/email-accounts/?api_key=${smartlead.apiKey}&offset=0&limit=10`
  );

  console.log(response.data);
};
