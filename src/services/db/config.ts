'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { ConfigDropdownOptions } from 'src/types/dropdown-types';
import { LeadStatusOption } from 'src/types/lead-status';

export const getConfigDropdownOptions = async ({
  key,
}: {
  key: string;
}): Promise<ConfigDropdownOptions[]> => {
  try {
    const platformOptions = await prisma.config.findFirst({
      where: {
        key,
      },
      select: {
        value: true,
      },
    });

    // Ensure value is an array and has the correct type
    if (Array.isArray(platformOptions?.value)) {
      return platformOptions.value as ConfigDropdownOptions[]; // Assert the type
    }

    // Return an empty array if the value isn't valid
    return [];
  } catch (error) {
    console.error('Error fetching platform options:', error);
    throw new Error('Failed to fetch platform options');
  }
};

export const getEmailServerOptions = async (): Promise<ConfigDropdownOptions[]> => {
  try {
    const emailServerOptions = await prisma.config.findFirst({
      where: {
        key: 'email_server_options',
      },
      select: {
        value: true,
      },
    });

    if (Array.isArray(emailServerOptions?.value)) {
      return emailServerOptions.value as ConfigDropdownOptions[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching email server options:', error);
    throw new Error('Failed to fetch email server options');
  }
};

export const getEmailResellerOptions = async (): Promise<ConfigDropdownOptions[]> => {
  try {
    const emailPlatformOptions = await prisma.config.findFirst({
      where: {
        key: 'email_reseller_options',
      },
      select: {
        value: true,
      },
    });

    if (Array.isArray(emailPlatformOptions?.value)) {
      return emailPlatformOptions.value as ConfigDropdownOptions[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching email reseller options:', error);
    throw new Error('Failed to fetch email reseller options');
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

    if (Array.isArray(leadStatusOptions?.value)) {
      return leadStatusOptions.value as LeadStatusOption[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching lead status options:', error);
    throw new Error('Failed to fetch lead status options');
  }
};
