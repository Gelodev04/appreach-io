'use server';

import { Prisma } from '@prisma/client';
import prisma from 'src/auth/lib/prisma/db-prisma';

export const getHostById = async (id: string, selectFields?: Prisma.userSettingsSelect) => {
  try {
    if (!id) {
      throw new Error('Access denied.');
    }

    const host = await prisma.hosts.findUnique({
      where: {
        id,
      },
      select: selectFields,
    });

    if (!host) {
      throw new Error('Host not found.');
    }

    return host;
  } catch (error) {
    console.error('Error on getting host:', error); // Log the actual error
    throw new Error('Failed to fetch host details.');
  }
};
