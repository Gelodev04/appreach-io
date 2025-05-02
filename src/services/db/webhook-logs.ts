'use server';

import axios from 'axios';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { env } from 'src/data/env/server';

export const getWebhookLogBySenderAccount = async (sender_account: string) => {
  try {
    const events = await prisma.webhook_logs.findMany({
      where: {
        sender_account,
      },
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    console.error('Error on getting emails:', error); // Log the actual error

    return {
      success: false,
      message: 'Unable to get sender events',
    };
  }
};

export const reprocessSendersWebhook = async (sender_account: string) => {
  try {
    const url = `${env.REPROCESS_SENDERS_FUNCTION}${encodeURIComponent(sender_account)}`;

    const res = await axios.post(url);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Error on reprocessing senders webhook:', error);
    return { success: false, message: 'Unable to reprocess senders webhook' };
  }
};
