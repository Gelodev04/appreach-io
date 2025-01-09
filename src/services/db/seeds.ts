'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { getUserSettings } from './user-settings';

export const getSeeds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    const seeds = await prisma.seedBatches.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
    });

    return seeds;
  } catch (error) {
    console.log('Unable to get the seeds', error);
    return [];
  }
};
