'use server';

import axios from 'axios';

type UnverifiedEmailType = {
  id: string;
  value: string;
  token: string;
};

export const requestForEmailVerification = async ({ id, token }: UnverifiedEmailType) => {
  const webhookUrl = `${process.env.EMAIL_VERIFICATON_WEBHOOK}?id=${id}&token=${token}`;
  const { data } = await axios.post(webhookUrl);
  if (data?.status === 'SUCCESS') {
    return {
      ...data,
      confirmationUrl: `${process.env.EMAIL_VERIFICATON_WEBHOOK}/send-emails?token=${process.env.INVOKER_TOKEN}`,
    };
  }

  return data;
};
