'use server';

import axios from 'axios';
import { getUserSettings } from '../db/user-settings';

export const signupWebhook = async (id: string) => {
  try {
    if (!id) {
      throw Error('Unable to post webhook. No user id found');
    }
    const { appLogin, trackingMarketing, plan } = await getUserSettings();
    const data = {
      email: appLogin.username,
      fullName: `${appLogin.firstName} ${appLogin.lastName}`,
      companyName: appLogin.companyName,
      phone: appLogin.phone,
      hearAboutUs: trackingMarketing?.hearAboutUs,
      emailSendsPerDay: trackingMarketing?.emailsSendsPerDay,
      callRequested: trackingMarketing?.callRequested,
      ipAdress: trackingMarketing?.ipAddress,
      status: plan?.status,
      start_date: plan?.start_date,
      current_period_end: plan?.current_period_end,
      trial_end: plan?.trial_end,
      environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    };
    const baseUrl = 'https://hook.us1.make.com/mtoh9l8p1yy9cvia2hinin32fjxmej7a';
    await axios.post(baseUrl, data);
  } catch (error) {
    console.log('Unable to post web hook');
  }
};
