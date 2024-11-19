'use server';

import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import prisma from 'src/auth/lib/prisma/db-prisma';

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

export const createUnverifiedEmails = async (email: string, hostId: string) => {
  try {
    const token = randomUUID();
    const upsertUnverifiedEmails = await prisma.unverifiedSenders.upsert({
      where: {
        value: email,
        hostId,
      },
      update: {},
      create: {
        token,
        type: 'email',
        hostId,
        value: email,
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
