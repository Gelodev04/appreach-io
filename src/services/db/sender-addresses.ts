'use server';

import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { revalidatePath } from 'next/cache';
import { paths } from 'src/routes/paths';
import { getUserSettings } from './user-settings';

export const getVerifiedDomain = async (
  whereInput: Prisma.verifiedSenderDomainsWhereInput,
  selectFields?: Prisma.verifiedSenderDomainsSelect
) => {
  const session = await auth();
  const id = session?.user.id;
  try {
    if (!id) {
      throw new Error('Access denied.');
    }
    const verifiedDomains = await prisma.verifiedSenderDomains.findFirst({
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

export const createUnverifiedSenders = async (
  value: string,
  hostId: string,
  type: 'email' | 'domain'
) => {
  try {
    const token = randomUUID();
    const upsertUnverifiedSenders = await prisma.unverifiedSenders.upsert({
      where: {
        value,
        hostId,
      },
      update: {},
      create: {
        token: type === 'email' ? token : '',
        txtRecord: type === 'domain' ? token : '',
        type,
        hostId,
        value,
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
    return upsertUnverifiedSenders;
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

export const getUnverifiedSenderByEmail = async (email: string) => {
  try {
    const unverifiedSender = await prisma.unverifiedSenders.findUnique({
      where: {
        value: email,
        type: 'email',
      },
      select: {
        value: true,
        hostId: true,
      },
    });
    return unverifiedSender;
  } catch (error) {
    console.log('Unable to get unverified sender by email.', error);
    return null;
  }
};

export const getUnverifiedSenderByDomain = async (value: string) => {
  try {
    const unverifiedSender = await prisma.unverifiedSenders.findUnique({
      where: {
        value,
        type: 'domain',
      },
      select: {
        value: true,
        hostId: true,
      },
    });
    return unverifiedSender;
  } catch (error) {
    console.log('Unable to get unverified sender by domain.', error);
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
    const deleteActions: Record<string, () => Promise<any>> = {
      '0': async () => {
        const deleted = await prisma.verifiedSenderEmails.deleteMany({
          where: { id: { in: ids } },
        });
        revalidatePath(`${paths.senders.root}?tableIndex=0`);
        return deleted;
      },
      '1': async () => {
        const deleted = await prisma.unverifiedSenders.deleteMany({ where: { id: { in: ids } } });
        revalidatePath(`${paths.senders.root}?tableIndex=1`);
        return deleted;
      },
      '2': async () => {
        const deleted = await prisma.verifiedSenderDomains.deleteMany({
          where: { id: { in: ids } },
        });
        revalidatePath(`${paths.senders.root}?tableIndex=2`);
        return deleted;
      },
    };

    const deleteAction = deleteActions[tableIndex];
    if (deleteAction) {
      return await deleteAction();
    }

    return null; // Return null if no valid tableIndex is found
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
    const updateActions: Record<string, () => Promise<any>> = {
      '0': async () => {
        const updated = await prisma.verifiedSenderEmails.update(data);
        revalidatePath(`${paths.senders.root}?tableIndex=0`);
        return updated;
      },
      '1': async () => {
        const updated = await prisma.unverifiedSenders.update(data);
        revalidatePath(`${paths.senders.root}?tableIndex=1`);
        return updated;
      },
      '2': async () => {
        const updated = await prisma.verifiedSenderDomains.update(data);
        revalidatePath(`${paths.senders.root}?tableIndex=2`);
        return updated;
      },
    };

    const updateAction = updateActions[tableIndex];
    if (updateAction) {
      return await updateAction();
    }

    return null; // Return null if no valid tableIndex is found
  } catch (error) {
    console.log('Unable to delete', error);
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
    throw new Error('Unable to get the active sender emails');
  }
};
