'use server';

import { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { IHost } from 'src/types/host';

export const getHostById = async (
  id: string,
  selectFields?: Prisma.userSettingsSelect
): Promise<{ host: IHost | undefined; error: { status: string; message: string } | null }> => {
  // Explicitly setting return type here
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
      return { host: undefined, error: { status: '404', message: 'Host not found' } };
    }

    const { id: hostId, ...hostWithoutId } = host; // Destructure to remove id

    // Normalize the host object, replace id with _id
    const normalizedHost = {
      ...hostWithoutId,
      _id: new ObjectId(id), // Convert string id to ObjectId and add as _id
    };

    // Explicitly cast `host` to `IHost` to satisfy the type.
    return { host: normalizedHost as IHost, error: null };
  } catch (error) {
    console.error('Error on getting host:', error); // Log the actual error
    return { host: undefined, error: { status: '500', message: 'Failed to fetch host details' } }; // Throw a user-friendly error
  }
};
