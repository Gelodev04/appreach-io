'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
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
        textRecord: true,
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
