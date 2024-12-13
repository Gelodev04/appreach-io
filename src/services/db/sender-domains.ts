'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { randomUUID } from 'crypto';
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
