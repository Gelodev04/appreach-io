'use server';

import { UnverifiedSenderType } from '@prisma/client';
import axios from 'axios';
import { env } from 'src/data/env/server';

type UnverifiedEmailType = {
  id: string;
  value: string;
  token: string | null;
  type: UnverifiedSenderType;
  txtRecord: string | null;
};

export const requestForEmailVerification = async ({
  id,
  token,
  type,
  txtRecord,
}: UnverifiedEmailType) => {
  const routeToken = type === 'email' ? token : txtRecord;
  const webhookUrl = `${env.VERIFY_SENDERS_FUNCTION}?id=${id}&token=${routeToken}`;
  const { data } = await axios.post(webhookUrl);
  const route = type === 'email' ? '/sender-emails' : 'verify-domains';
  if (data?.status === 'SUCCESS') {
    return {
      ...data,
      confirmationUrl: `${env.VERIFY_SENDERS_FUNCTION}/${route}?token=${env.INVOKER_TOKEN}`,
    };
  }

  return data;
};
