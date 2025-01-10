'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';

import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
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

export const deleteSeedsByIds = async (ids: string[]): Promise<any | null> => {
  const numberToBeDeleted = ids.length;
  const session = await auth();
  const id = session?.user.id;
  if (!id) {
    throw new Error('Access denied.');
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.seedBatches.deleteMany({
        where: { id: { in: ids } },
      });
      await tx.userSettings.update({
        where: { id },
        data: {
          planPermissionsUsed: {
            update: {
              seeds: {
                decrement: numberToBeDeleted,
              },
            },
          },
        },
        select: {
          id: true,
          appLogin: false,
        },
      });
    });
    revalidatePath(paths.seed.root);
    return result;
  } catch (error) {
    console.log('Unable to delete', error);
    throw new Error("Couldn't delete seeds");
  }
};
