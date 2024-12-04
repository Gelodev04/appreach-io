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
  const route = type === 'email' ? 'send-emails' : 'verify-domains';
  const webhookUrl = `${env.VERIFY_SENDERS_FUNCTION}${route}?token=${env.INVOKER_TOKEN}`;
  console.log({ webhookUrl });
  const { data } = await axios.post(webhookUrl);
  if (data?.status === 'SUCCESS') {
    console.log({ data });
    return data;
  }

  return data;
};
