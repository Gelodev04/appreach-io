'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
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
      const deletedEmail = await prisma.senderAddresses.delete({
        where: {
          id,
        },
      });

      revalidatePath(`${paths.senders.root}?tableIndex=0`);

      return deletedEmail;
    }
  } catch (error) {
    console.log('Unable to delete  sender', error);
    throw new Error('Unable to delete sender', error);
  }
};

export const updateDomainToReadyStatus = async (id: string) => {
  try {
    const updatedDomainReadyStatus = await prisma.senderDomains.update({
      where: {
        id,
      },
      data: {
        status: 'ready',
      },
    });

    revalidatePath(`${paths.senders.root}?tableIndex=2`);

    return updatedDomainReadyStatus;
  } catch (error) {
    console.log('Unable to update domain status to ready.', error);
    throw new Error('Unable to update domain status to ready.', error);
  }
};

export const getSenderByDomain = async (domain: string) => {
  try {
    const senderDomain = await prisma.senderDomains.findUnique({
      where: {
        domain,
      },
      select: {
        domain: true,
        hostId: true,
      },
    });
    return senderDomain;
  } catch (error) {
    console.log('Unable to get unverified sender by domain.', error);
    return null;
  }
};

export const createSenderDomain = async ({
  domain,
  hostId,
  isVerified,
}: {
  domain: string;
  hostId: string;
  isVerified: boolean;
}) => {
  try {
    const token = randomUUID();
    const newSenderAddress = await prisma.senderDomains.upsert({
      where: {
        domain,
        hostId,
      },
      update: {},
      create: {
        verified: isVerified,
        txtRecord: token,
        hostId,
        status: 'ready',
        domain,
      },
      select: {
        id: true,
        txtRecord: true,
        domain: true,
      },
    });
    return newSenderAddress;
  } catch (error) {
    console.log('Error on creating sender domain');
    throw new Error('Error on create senders domain', error);
  }
};

export const getVerifiedDomain = async (
  whereInput: Prisma.senderDomainsWhereInput,
  selectFields?: Prisma.senderDomainsSelect
) => {
  const session = await auth();
  const id = session?.user.id;
  try {
    if (!id) {
      throw new Error('Access denied.');
    }
    const verifiedDomains = await prisma.senderDomains.findFirst({
      where: whereInput,
      select: selectFields,
    });

    if (!verifiedDomains) {
      return null;
    }

    return verifiedDomains;
  } catch (error) {
    console.error('Error on getting verified domains:', error); // Log the actual error
    throw new Error('Error on getting verified domains'); // Throw a user-friendly error
  }
};

export const updateDomainProfiles = async (
  id: string,
  hostId: string,
  tableIndex: string
): Promise<any | null> => {
  try {
    const data = {
      where: {
        id,
      },
      data: {
        hostId,
      },
    };
    const updated = await prisma.senderDomains.update(data);
    revalidatePath(`${paths.senders.root}?tableIndex=${tableIndex}`);
    return updated; // Return null if no valid tableIndex is found
  } catch (error) {
    console.log('Unable to update hostId', error);
    return null;
  }
};
