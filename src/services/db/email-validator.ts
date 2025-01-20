'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';

export const getAllEmailValidator = async () => {
  try {
    const emails = await prisma.emailValidator.findMany();
    return emails;
  } catch (error) {
    console.error('Error on getting emails:', error); // Log the actual error
    throw new Error(`Unable to get emails: ${error.message}`);
  }
};
