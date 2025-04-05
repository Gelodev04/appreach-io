'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { getUserSettings } from './user-settings';

export const getLeadStatusByHostIds = async () => {
  try {
    const { hosts } = await getUserSettings({ hosts: true });

    if (!hosts) throw new Error(`Unable to get hosts`);

    const leadStatus = await prisma.events.findMany({
      where: {
        host_id: {
          in: hosts,
        },
        event_type: 'lead_status_updated',
      },
    });

    return leadStatus;
  } catch (error) {
    console.error('Error on getting lead status:', error); // Log the actual error
    throw new Error(`Unable to get lead status`);
  }
};
