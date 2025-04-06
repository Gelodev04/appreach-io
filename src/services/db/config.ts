'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { LeadStatusOption, PlatformOption } from 'src/types/lead-status';

export const getPlatformOptions = async (): Promise<PlatformOption[]> => {
  try {
    const platformOptions = await prisma.config.findFirst({
      where: {
        key: 'platform_options',
      },
      select: {
        value: true,
      },
    });

    // Ensure value is an array and has the correct type
    if (Array.isArray(platformOptions?.value)) {
      return platformOptions.value as PlatformOption[]; // Assert the type
    }

    // Return an empty array if the value isn't valid
    return [];
  } catch (error) {
    console.error('Error fetching platform options:', error);
    throw new Error('Failed to fetch platform options');
  }
};

export const getLeadStatusOptions = async (): Promise<LeadStatusOption[]> => {
  try {
    const leadStatusOptions = await prisma.config.findFirst({
      where: {
        key: 'lead_status_options',
      },
      select: {
        value: true,
      },
    });

    // Ensure value is an array and has the correct type
    if (Array.isArray(leadStatusOptions?.value)) {
      return leadStatusOptions.value as LeadStatusOption[]; // Assert the type
    }

    // Return an empty array if the value isn't valid
    return [];
  } catch (error) {
    console.error('Error fetching lead status options:', error);
    throw new Error('Failed to fetch lead status options');
  }
};
