'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { getUserSettings } from './user-settings';

export const getSenderDomains = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    const senderDomains = await prisma.senderDomains.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
      select: {
        id: true,
        domain: true,
        txtRecord: true,
        verified: true,
        hostId: true,
      },
    });

    return senderDomains;
  } catch (error) {
    console.log('Unable to get the sender domains', error);
    return [];
  }
};

export const deleteSender = async (id: string, type: 'domain' | 'email') => {
  try {
    if (type === 'domain') {
      const deletedDomain = await prisma.senderDomains.delete({
        where: {
          id,
        },
      });

      revalidatePath(`${paths.senders.root}?tableIndex=2`);

      return deletedDomain;
    }
    if (type === 'email') {
      const deletedDomain = await prisma.senderAddresses.delete({
        where: {
          id,
        },
      });

      revalidatePath(`${paths.senders.root}?tableIndex=0`);

      return deletedDomain;
    }
  } catch (error) {
    console.log('Unable to delete  sender', error);
    throw new Error('Unable to delete sender', error);
  }
};
