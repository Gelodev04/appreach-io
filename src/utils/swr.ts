import { mutate } from 'swr';

export const revalidateData = async (url: string) => {
  await mutate(url, undefined, { revalidate: true });
};

export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      return response.json().then((json) => {
        throw new Error(json.error);
      });
    }
    return response.json();
  });

export const endpoints = {
  lookerStudio: '/api/looker-studio/',
  auth: {
    me: '/api/auth/me/',
    login: '/api/auth/login/',
    register: '/api/auth/register/',
    resetPassword: '/api/auth/reset-password/',
    confirmResetPassword: '/api/auth/confirm-reset-password/',
    verifyAccount: '/api/auth/verify-account/',
    checkEmailExists: (email: string) => `/api/auth/check-email-exists/?email=${email}`,
  },
  host: {
    list: '/api/host/list/',
    details: (hostId: string) => `/api/host/details/?hostId=${hostId}`,
    addExistingHost: '/api/host/add-existing-host/',
    create: '/api/host/create/',
    edit: '/api/host/edit/',
    delete: '/api/host/delete/',
  },
  seed: {
    list: '/api/seed/list/',
    counts: '/api/seed/counts/',
    create: '/api/seed/create/',
    settings: '/api/seed/settings/',
    delete: '/api/seed/delete/',
  },
  csvUpload: {
    list: '/api/csv-upload/list/',
    create: '/api/csv-upload/create/',
  },
  stripe: {
    checkoutSession: '/api/stripe/checkout-session/',
    subscriptions: '/api/stripe/subscriptions/',
    cancelSubscription: '/api/stripe/subscriptions/cancel/',
  },
  plan: {
    checkPlan: '/api/plan/check-plan/',
  },
  senders: {
    list: '/api/senders/list/',
  },
};
