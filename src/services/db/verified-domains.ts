'use server';

import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';
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
        textRecord: type === 'domain' ? token : '',
        type,
        hostId,
        value,
        status: 'ready',
      },
      select: {
        id: true,
        token: true,
        value: true,
        textRecord: true,
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
      },
    });
    return listOfUnverifiedEmails.map(({ id, value, hostId }) => ({ id, email: value, hostId }));
  } catch (error) {
    console.log('Unable to get verified emails.', error);
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
    console.log('Unable to get verified emails.', error);
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
      },
    });
    return upsertUnverifiedEmails;
  } catch (error) {
    console.log('Error on creating unverified emails');
    throw new Error('Error on create unverified emails', error);
  }
};
