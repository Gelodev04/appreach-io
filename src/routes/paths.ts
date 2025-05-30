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
  sharable: {
    root: '/sharable',
    overview: (tokens: string = 'sample_token') => `/sharable/${tokens}`,
  },

  flaskApp: {
    root: ROOTS.FLASK_APP,
  },
  website: {
    root: ROOTS.MAIN_WEBSITE,
    terms: `${ROOTS.OUTREACH_MAGIC}/terms-of-use/`,
    privacy: `${ROOTS.OUTREACH_MAGIC}/privacy-policy/`,
    contactUs: `${ROOTS.OUTREACH_MAGIC}/contact-us`,
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
    notifications: (id: string) => `${ROOTS.SETTINGS}/notifications/${id}`,
  },

  // SEEDS
  seed: {
    root: ROOTS.SEEDS,
    new: `${ROOTS.SEEDS}/new`,
    edit: `${ROOTS.SEEDS}/edit`,
  },

  checkout: {
    root: '/billing',
    success: '/billing/success',
    signup1: '/signup/1',
    signup2: '/signup/2',
    billingPortal: (email: string) =>
      `https://clients.outreachmagic.io/order/OM/portal?email=${email}`,
  },

  senders: {
    root: ROOTS.SENDERS,
    verifiedSenders: `${ROOTS.SENDERS}/verified-senders`,
    linkedin: `${ROOTS.SENDERS}/linkedin`,
    emailEvents: `${ROOTS.SENDERS}/email-events`,
    smartlead: `${ROOTS.SENDERS}/smartlead`,
    instantly: `${ROOTS.SENDERS}/instantly`,
    emailBison: `${ROOTS.SENDERS}/email-bison`,
    prosp: `${ROOTS.SENDERS}/prosp`,
    heyReach: `${ROOTS.SENDERS}/heyreach`,
    email: `${ROOTS.SENDERS}/email`,
    domain: `${ROOTS.SENDERS}/domain`,
    filter: (id: string) => `${ROOTS.SENDERS}/verified-senders/?hostId=${id}`,
  },

  profiles: {
    root: '/profiles',
  },

  manualEvents: {
    root: '/manual-events',
    update: '/manual-events/update',
  },

  emailValidator: {
    root: '/email-validator',
    new: '/email-validator/new',
  },

  attributesUpload: {
    root: '/attribute-uploads',
    new: '/attribute-uploads/new',
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

  eventSenders: {
    root: '/event-senders',
  },

  onboarding: {
    root: '/onboarding',
  },

  support: {
    link: 'https://join.slack.com/t/outreachmagic/shared_invite/zt-2gnuajfkz-7J9PzelJ21tstw4Axzj17Q',
  },
};
