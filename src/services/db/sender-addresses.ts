'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { paths } from 'src/routes/paths';
import { getUserSettings } from './user-settings';

export const createSenderAddress = async ({
  email,
  hostId,
  isVerified,
}: {
  email: string;
  hostId: string;
  isVerified: boolean;
}) => {
  try {
    const token = randomUUID();
    const newSenderAddress = await prisma.senderAddresses.upsert({
      where: {
        email,
        hostId,
      },
      update: {},
      create: {
        archived: false,
        verified: isVerified,
        emailToken: token,
        hostId,
        status: 'ready',
        email,
      },
      select: {
        id: true,
        emailToken: true,
        email: true,
      },
    });
    revalidatePath(paths.senders.root);
    // revalidatePath(paths.senders.root);
    return newSenderAddress;
  } catch (error) {
    console.log('Error on creating unverified senders');
    throw new Error('Error on create unverified senders', error);
  }
};

export const getSenderByEmail = async (email: string) => {
  try {
    const senderEmail = await prisma.senderAddresses.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        hostId: true,
      },
    });
    return senderEmail;
  } catch (error) {
    console.log('Unable to get  sender by email.', error);
    return null;
  }
};

export const getSenderAddressByHostId = async (hostId: string) => {
  try {
    const senderHostId = await prisma.senderAddresses.findFirst({
      where: {
        hostId,
      },
      select: {
        hostId: true,
      },
    });
    return senderHostId;
  } catch (error) {
    console.log('Unable to get sender by hostId.', error);
    return null;
  }
};

export const deleteSenderAddressById = async (
  ids: string[],
  tableIndex: string
): Promise<any | null> => {
  try {
    const deleted = await prisma.senderAddresses.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(`${paths.senders.root}?tableIndex=${tableIndex}`);
    return deleted;
  } catch (error) {
    console.log('Unable to delete', error);
    return null;
  }
};

export const updateSenderProfiles = async (
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
    const updated = await prisma.senderAddresses.update(data);
    revalidatePath(`${paths.senders.root}?tableIndex=${tableIndex}`);
    return updated; // Return null if no valid tableIndex is found
  } catch (error) {
    console.log('Unable to update hostId', error);
    return null;
  }
};

export const getActiveSenderEmails = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    const senderEmails = await prisma.senderAddresses.findMany({
      where: {
        hostId: {
          in: hosts,
        },
        archived: false,
      },
      select: {
        id: true,
        email: true,
        emailToken: true,
        verified: true,
        archived: true,
        hostId: true,
      },
    });

    return senderEmails;
  } catch (error) {
    console.log('Unable to get the active sender emails', error);
    return [];
  }
};
export const getArhivedSenderEmails = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    const archivedSenderEmails = await prisma.senderAddresses.findMany({
      where: {
        hostId: {
          in: hosts,
        },
        archived: true,
      },
      select: {
        id: true,
        email: true,
        emailToken: true,
        verified: true,
        archived: true,
        hostId: true,
      },
    });

    return archivedSenderEmails;
  } catch (error) {
    console.log('Unable to get the archived sender emails', error);
    return [];
  }
};

export const archiveSenderEmail = async (id: string) => {
  try {
    const archiveEmail = await prisma.senderAddresses.update({
      where: {
        id,
      },
      data: {
        archived: true,
      },
      select: {
        archived: true,
      },
    });

    revalidatePath(`${paths.senders.root}?tableIndex=0`);
    return archiveEmail.archived;
  } catch (error) {
    throw new Error('Unable to archive sender email. Please contact support');
  }
};

export const unArchiveSenderEmail = async (id: string) => {
  try {
    const archiveEmail = await prisma.senderAddresses.update({
      where: {
        id,
      },
      data: {
        archived: false,
      },
      select: {
        archived: true,
      },
    });

    revalidatePath(`${paths.senders.root}?tableIndex=1`);
    return archiveEmail.archived;
  } catch (error) {
    throw new Error('Unable to archive sender email. Please contact support');
  }
};

export const updateSenderToReadyStatus = async (id: string) => {
  try {
    const updatedEmailReadyStatus = await prisma.senderAddresses.update({
      where: {
        id,
      },
      data: {
        status: 'ready',
      },
    });

    revalidatePath(`${paths.senders.root}?tableIndex=0`);

    return updatedEmailReadyStatus;
  } catch (error) {
    console.log('Unable to update sender status to ready.', error);
    throw new Error('Unable to update sender status to ready.', error);
  }
};

export const getVerifiedSenderAddressByHostId = async (hostId: string) => {
  try {
    const hostSenderAddress = await prisma.senderAddresses.findMany({
      where: {
        hostId,
        archived: false,
        verified: true,
      },
      select: {
        email: true,
      },
    });
    return hostSenderAddress;
  } catch (error) {
    console.log('Unable to get sender address by hostId.', error);
    throw new Error(`Unable to get host: ${error.message}`);
  }
};
