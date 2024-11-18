'use server';

import { Prisma } from '@prisma/client';
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
