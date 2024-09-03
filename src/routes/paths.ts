// ----------------------------------------------------------------------

import { ObjectId } from 'mongodb';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  SEEDS: '/seeds',
  MAIN_WEBSITE: 'https://outreachmagic.io',
  FLASK_APP: 'https://app.outreachmagic.io',
};

// ----------------------------------------------------------------------

export const paths = {
  flaskApp: {
    root: ROOTS.FLASK_APP,
  },
  website: {
    root: ROOTS.MAIN_WEBSITE,
    terms: `${ROOTS.MAIN_WEBSITE}/terms-of-uses/`,
    privacy: `${ROOTS.MAIN_WEBSITE}/privacy/`,
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
    edit: (id: ObjectId) => `${ROOTS.SETTINGS}/edit/?id=${id.toString()}`,
  },

  // SEEDS
  seed: {
    root: ROOTS.SEEDS,
    new: `${ROOTS.SEEDS}/new`,
    edit: `${ROOTS.SEEDS}/edit`,
  },
};
