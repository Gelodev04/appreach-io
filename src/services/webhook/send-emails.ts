'use server';

import { UnverifiedSenderType } from '@prisma/client';
import axios from 'axios';
import { env } from 'src/data/env/server';

type SenderVerificationType = {
  type: UnverifiedSenderType;
};

export const sendSenderVerification = async ({ type }: SenderVerificationType) => {
  try {
    const route = type === 'email' ? 'send-emails' : 'verify-domains';
    const webhookUrl = `${env.VERIFY_SENDERS_FUNCTION}${route}?token=${env.INVOKER_TOKEN}`;
    const { data } = await axios.post(webhookUrl);
    if (data?.status === 'SUCCESS') {
      return data;
    }
    return data;
  } catch (error) {
    console.error('Error sending sender verification:', error);
    throw new Error('Failed to send sender verification');
  }
};
