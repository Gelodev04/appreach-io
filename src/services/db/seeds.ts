'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';

import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { getUserSettings, updateUserSettings } from './user-settings';

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

export const deleteSeedsByIds = async (ids: string[]): Promise<any | null> => {
  const numberToBeDeleted = ids.length;
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.seedBatches.deleteMany({
        where: { id: { in: ids } },
      });
      const { planPermissionsUsed } = await getUserSettings({ planPermissionsUsed: true });
      const updatedSeeds = planPermissionsUsed.seeds - numberToBeDeleted;
      await updateUserSettings(
        { planPermissionsUsed: { update: { seeds: updatedSeeds } } },
        { id: true }
      );
    });
    revalidatePath(paths.seed.root);
    return result;
  } catch (error) {
    console.log('Unable to delete', error);
    return null;
  }
};
