'use server';

import axios from 'axios';

type UnverifiedEmailType = {
  id: string;
  value: string;
  token: string;
};

export const requestForEmailVerification = async ({ id, token, value }: UnverifiedEmailType) => {
  const webhookUrl = `${process.env.EMAIL_VERIFICATON_WEBHOOK}?id=${id}&token=${token}`;
  const { data } = await axios.post(webhookUrl);
  if (data?.status === 'SUCCESS') {
    return {
      ...data,
      confirmationUrl: `${process.env.EMAIL_VERIFICATION_WEBHOOK}/send-emails?token=${token}`,
    };
  }

  return data;
};
