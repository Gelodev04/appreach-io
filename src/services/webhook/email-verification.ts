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

  return data?.status === 'SUCCESS';
};
