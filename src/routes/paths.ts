// ----------------------------------------------------------------------

import { ObjectId } from 'mongodb';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
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
    forgotPassword: `/reset-password`,
  },
  resetPassword: (id: ObjectId, token: string) => `/reset-password/id=${id.toString()}/${token}`,

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      new: `${ROOTS.DASHBOARD}/settings/new`,
      edit: (id: ObjectId) => `${ROOTS.DASHBOARD}/settings/edit/?id=${id.toString()}`,
    },
    seed: {
      root: `${ROOTS.DASHBOARD}/seed`,
      new: `${ROOTS.DASHBOARD}/seed/new`,
      edit: `${ROOTS.DASHBOARD}/seed/edit`,
    },
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
    logout: {
      root: `${ROOTS.DASHBOARD}/logout`,
    },
  },
};
