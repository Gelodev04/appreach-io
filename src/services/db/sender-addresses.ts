'use server';

import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { getUserSettings } from './user-settings';

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
    return newSenderAddress;
  } catch (error) {
    console.log('Error on creating unverified senders');
    throw new Error('Error on create unverified senders', error);
  }
};

export const createVerifiedEmails = async (email: string, hostId: string) => {
  try {
    const upsertVerifiedEmails = await prisma.verifiedSenderEmails.upsert({
      where: {
        email,
        hostId,
      },
      update: {
        dateAdded: new Date(),
        dateVerified: new Date(),
      },
      create: {
        verifiedVia: 'domain',
        hostId,
        dateAdded: new Date(),
        dateVerified: new Date(),
        email,
      },
    });
    return upsertVerifiedEmails;
  } catch (error) {
    console.log('Error on creating unverified emails');
    throw new Error('Error on create unverified emails', error);
  }
};

export const getVerifiedEmails = async (type: 'email' | 'domain') => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });
    if (type === 'email') {
      const listOfVerifiedEmails = await prisma.verifiedSenderEmails.findMany({
        where: {
          hostId: {
            in: hosts,
          },
        },
        select: {
          id: true,
          email: true,
          hostId: true,
        },
      });
      return listOfVerifiedEmails;
    }

    if (type === 'domain') {
      const listOfVerifiedDomains = await prisma.verifiedSenderDomains.findMany({
        where: {
          hostId: {
            in: hosts,
          },
        },
        select: {
          id: true,
          domain: true,
          hostId: true,
        },
      });
      return listOfVerifiedDomains.map(({ id, domain, hostId }) => ({
        id,
        email: domain,
        hostId,
      }));
    }
  } catch (error) {
    console.log('Unable to get verified emails.', error);
    return [];
  }
};

export const getVerifiedSenderByEmail = async (email: string) => {
  try {
    const verifiedEmail = await prisma.verifiedSenderEmails.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        hostId: true,
      },
    });
    return verifiedEmail;
  } catch (error) {
    console.log('Unable to get verified sender by email', error);
    throw new Error('Unable to get verified sender by email', error);
  }
};

export const getVerifiedSenderByDomain = async (domain: string) => {
  try {
    const verifiedEmail = await prisma.verifiedSenderDomains.findUnique({
      where: {
        domain,
      },
      select: {
        id: true,
        domain: true,
        hostId: true,
      },
    });
    return verifiedEmail;
  } catch (error) {
    console.log('Unable to get verified domain ', error);
    throw new Error('Unable to get verified domain ', error);
  }
};

export const getUnverifiedSenders = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    const listOfUnverifiedEmails = await prisma.unverifiedSenders.findMany({
      where: {
        hostId: {
          in: hosts,
        },
      },
      select: {
        id: true,
        value: true,
        hostId: true,
        txtRecord: true,
      },
    });
    return listOfUnverifiedEmails.map(({ id, value, hostId, txtRecord }) => ({
      id,
      email: value,
      hostId,
      txtRecord,
    }));
  } catch (error) {
    console.log('Unable to get unverified senders.', error);
    return [];
  }
};

export const getUnverifiedSenderById = async (id: string) => {
  try {
    const unverifiedSender = await prisma.unverifiedSenders.findUnique({
      where: {
        id,
      },
      select: {
        value: true,
        hostId: true,
      },
    });
    return unverifiedSender;
  } catch (error) {
    console.log('Unable to get unverified sender by id.', error);
    return null;
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

export const updateUnverifiedEmails = async (id: string) => {
  try {
    const upsertUnverifiedEmails = await prisma.unverifiedSenders.update({
      where: {
        id,
      },
      data: {
        status: 'ready',
      },
      select: {
        id: true,
        token: true,
        value: true,
        txtRecord: true,
        type: true,
      },
    });
    return upsertUnverifiedEmails;
  } catch (error) {
    console.log('Error on creating unverified emails');
    throw new Error('Error on create unverified emails', error);
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
