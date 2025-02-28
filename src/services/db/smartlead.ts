'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { env } from 'src/data/env/server';
import { paths } from 'src/routes/paths';
import { UpdateSmartleadEsp, UpdateSmartleadHost } from 'src/types/smartlead';
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

export const smartleadAccountsWebhook = async (id: string) => {
  try {
    const url = `${env.SMARTLEAD_ACCOUNTS_FUNCTION}${id}`;
    const response = await axios.post(url);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error on Smartlead Account Function:', error);

    return {
      success: false,
      message: 'Failed to sync accounts. Please try again later.',
    };
  }
};

export const updateSmartleadHost = async (id: string, host: UpdateSmartleadHost) => {
  try {
    const data = {
      where: {
        id,
      },
      data: {
        hostId: host.hostId,
        hostName: host.hostName,
        lastUpdated: new Date(),
      },
    };
    await prisma.smartleadEmailAccounts.update(data);
    revalidatePath(paths.smartlead.root);

    return { success: true };
  } catch (error) {
    console.error('Error on Smartlead Host Update:', error);

    return {
      success: false,
      message: 'Failed to update smartlead host. Please try again later.',
    };
  }
};

export const updateSmartleadEsp = async (id: string, esp: UpdateSmartleadEsp) => {
  try {
    const data = {
      where: {
        id,
      },
      data: {
        esp: esp.esp,
        espCamelCase: esp.espCamelCase,
        server: esp.server,
        lastUpdated: new Date(),
      },
    };
    await prisma.smartleadEmailAccounts.update(data);
    revalidatePath(paths.smartlead.root);

    return { success: true };
  } catch (error) {
    console.error('Error on Smartlead ESP Update:', error);

    return {
      success: false,
      message: 'Failed to update smartlead ESP. Please try again later.',
    };
  }
};

export const updateMultipleSmartlead = async (
  ids: string[],
  data: UpdateSmartleadHost | UpdateSmartleadEsp
) => {
  try {
    await prisma.smartleadEmailAccounts.updateMany({
      where: {
        id: { in: ids },
      },
      data,
    });

    revalidatePath(paths.smartlead.root);
    return { success: true };
  } catch (error) {
    console.error('Error updating Smartlead records:', error);

    return {
      success: false,
      message: 'Failed to update Smartlead records Please try again later.',
    };
  }
};
