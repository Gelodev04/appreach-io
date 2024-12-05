'use server';

import { UnverifiedSenderType } from '@prisma/client';
import axios from 'axios';
import { env } from 'src/data/env/server';

type SenderVerificationType = {
  type: UnverifiedSenderType;
};

type VerifySenderType = {
  id: string;
  token: string;
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

export const verifySender = async ({ id, token }: VerifySenderType) => {
  try {
    const webhookUrl = `${env.VERIFY_SENDERS_FUNCTION}verify-email/${id}/${token}?token=${env.INVOKER_TOKEN}`;
    const { data } = await axios.post(webhookUrl);
    switch (data?.status) {
      case 'VERIFIED':
        return {
          message: 'Sender address is verified. You can close this page.',
          variant: 'success',
        };
      case 'ALREADY_VERIFIED':
        return {
          message: 'Sender address is verified. You can close this page.',
          variant: 'info',
        };
      case 'ERROR':
        return { message: 'There was an error, please contact support.', variant: 'error' };
      default:
        return { message: 'Unexpected status received.' };
    }
  } catch (error) {
    console.error('Error sending sender verification:', error);
    throw new Error('Failed to send sender verification');
  }
};
