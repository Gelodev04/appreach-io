'use server';

import prisma from 'src/auth/lib/prisma/db-prisma';
import { LeadStatusData } from 'src/types/lead-status';
import { getHostById } from './hosts';
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
export const createLeadStatus = async (data: LeadStatusData) => {
  try {
    const { hostCrypt } = await getHostById(data.host_id, { hostCrypt: true });
    const { id } = await getUserSettings({ id: true });

    const normalizedLeads = data.leads.map((lead) => {
      if (!lead.includes('linkedin')) {
        return lead;
      }
      return lead
        .replace(/^https:\/\/www\./, '') // Remove "https://www.linkedin.com/"
        .replace(/\/$/, ''); // Remove trailing "/"
    });

    const eventsToCreate = normalizedLeads.map((email) => {
      const recipient = email.includes('linkedin')
        ? { linkedin_url: email } // If "email" contains "linkedin", set recipient as { linkedin_url: email }
        : { email }; // Otherwise, set recipient as { email: email }

      let sender;
      if (data.senders === 'n/a') {
        sender = {};
      } else if (data.senders.includes('linkedin')) {
        sender = { linkedin_profile: data.senders };
      } else {
        sender = { email: data.senders };
      }

      return {
        event_timestamp: data.event_timestamp,
        event_type: 'lead_status_updated',
        platform: data.platform,
        content: {
          body: data.content.body,
        },
        host_id: data.host_id,
        host_name: data.host_name,
        host_crypt: hostCrypt,
        lead_status: {
          name: data.lead_status.name,
          sentiment: data.lead_status.sentiment,
        },
        metadata: {
          bigquery_sync_status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        },
        recipient,
        sender,
        update_history: [
          {
            source: 'webapp',
            host_id: data.host_id,
            updated_at: new Date(),
          },
        ],
        user_id: id,
      };
    });

    // Insert all events in a single call (better performance)
    await prisma.events.createMany({
      data: eventsToCreate,
    });

    return { success: true };
  } catch (error) {
    console.error('Error on creating lead status:', error); // Log the actual error
    return {
      success: false,
      message: 'Unable to update lead status',
    };
  }
};
