'use server';

import { UnverifiedSenderType } from '@prisma/client';
import axios from 'axios';
import { env } from 'src/data/env/server';

type UnverifiedEmailType = {
  id: string;
  value: string;
  token: string | null;
  type: UnverifiedSenderType;
  textRecord: string | null;
};

export const requestForEmailVerification = async ({
  id,
  token,
  type,
  textRecord,
}: UnverifiedEmailType) => {
  const routeToken = type === 'email' ? token : textRecord;
  const webhookUrl = `${env.EMAIL_VERIFICATON_WEBHOOK}?id=${id}&token=${routeToken}`;
  const { data } = await axios.post(webhookUrl);
  const route = type === 'email' ? '/sender-emails' : 'verify-domains';
  if (data?.status === 'SUCCESS') {
    return {
      ...data,
      confirmationUrl: `${env.EMAIL_VERIFICATON_WEBHOOK}/${route}?token=${env.INVOKER_TOKEN}`,
    };
  }

  return data;
};
