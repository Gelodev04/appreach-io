// ----------------------------------------------------------------------

import { ObjectId } from 'mongodb';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SETTINGS: '/profiles',
  SEEDS: '/seeds',
  SENDERS: '/senders',
  MAIN_WEBSITE: 'https://outreachmagic.io',
  FLASK_APP: 'https://app.outreachmagic.io',
  INBOX_DADDY: 'https://inboxdaddy.com',
  OUTREACH_MAGIC: 'https://outreachmagic.io',
};

// ----------------------------------------------------------------------

export const paths = {
  flaskApp: {
    root: ROOTS.FLASK_APP,
  },
  website: {
    root: ROOTS.MAIN_WEBSITE,
    terms: `${ROOTS.OUTREACH_MAGIC}/terms-of-use/`,
    privacy: `${ROOTS.OUTREACH_MAGIC}/privacy-policy/`,
    contactUs: `${ROOTS.INBOX_DADDY}/contact-us`,
  },
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/reset-password`,
    logout: `${ROOTS.AUTH}/logout`,
    resetPassword: (id: ObjectId, token: string) =>
      `${ROOTS.AUTH}/reset-password/${id.toString()}/${token}`,
    verifyAccount: (id: ObjectId, token: string) =>
      `${ROOTS.AUTH}/verify-account/${id.toString()}/${token}`,
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    emails: {
      root: `${ROOTS.DASHBOARD}/emails`,
      new: `${ROOTS.DASHBOARD}/emails/new`,
      addEmailsBulk: `${ROOTS.DASHBOARD}/emails/add-emails-bulk`,
      edit: `${ROOTS.DASHBOARD}/emails/edit`,
    },
    csvUpload: {
      root: `${ROOTS.DASHBOARD}/csv-upload`,
      new: `${ROOTS.DASHBOARD}/csv-upload/new`,
      edit: `${ROOTS.DASHBOARD}/csv-upload/edit`,
    },
  },

  // SETTINGS
  settings: {
    root: ROOTS.SETTINGS,
    new: `${ROOTS.SETTINGS}/new`,
    smartlead: (id: string) => `${ROOTS.SETTINGS}/smartlead/${id}`,
    seeds: (id: string) => `${ROOTS.SETTINGS}/seeds/${id}`,
  },

  // SEEDS
  seed: {
    root: ROOTS.SEEDS,
    new: `${ROOTS.SEEDS}/new`,
    edit: `${ROOTS.SEEDS}/edit`,
  },

  checkout: {
    root: '/subscription',
    success: '/subscription/success',
    trial1: '/trial/1',
    trial2: '/trial/2',
    billingPortal: (email: string) =>
      `https://clients.outreachmagic.io/order/OM/portal?email=${email}`,
  },

  senders: {
    root: ROOTS.SENDERS,
    nonApiEmails: `${ROOTS.SENDERS}/non-api-emails`,
    nonApiLinkedins: `${ROOTS.SENDERS}/non-api-linkedins`,
    smartlead: `${ROOTS.SENDERS}/smartlead`,
    instantly: `${ROOTS.SENDERS}/instantly`,
    emailBison: `${ROOTS.SENDERS}/email-bison`,
    prosp: `${ROOTS.SENDERS}/prosp`,
    heyReach: `${ROOTS.SENDERS}/heyreach`,
    email: `${ROOTS.SENDERS}/email`,
    domain: `${ROOTS.SENDERS}/domain`,
    filter: (id: string) => `${ROOTS.SENDERS}/non-api-emails/?hostId=${id}`,
  },

  profiles: {
    root: '/profiles',
  },

  leadStatus: {
    root: '/lead-status',
    update: '/lead-status/update',
  },

  emailValidator: {
    root: '/email-validator',
    new: '/email-validator/new',
  },

  attributesUpload: {
    root: '/attributes-uploads',
    new: '/attributes-uploads/new',
  },

  smartlead: {
    root: '/smartlead',
  },

  hubspot: {
    root: '/hubspot',
  },

  webhooks: {
    root: '/webhooks',
  },
};
