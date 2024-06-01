// ----------------------------------------------------------------------

import { ObjectId } from 'mongodb';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MAIN_WEBSITE: 'https://outreachmagic.io',
};

// ----------------------------------------------------------------------

export const paths = {
  website: {
    root: ROOTS.MAIN_WEBSITE,
    terms: `${ROOTS.MAIN_WEBSITE}/terms-of-uses/`,
    privacy: `${ROOTS.MAIN_WEBSITE}/privacy/`,
  },
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    host: {
      root: `${ROOTS.DASHBOARD}/host`,
      new: `${ROOTS.DASHBOARD}/host/new`,
      edit: (id: ObjectId) => `${ROOTS.DASHBOARD}/host/edit/?id=${id.toString()}`,
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
    csvUploads: {
      root: `${ROOTS.DASHBOARD}/csv-uploads`,
      new: `${ROOTS.DASHBOARD}/csv-uploads/new`,
      edit: `${ROOTS.DASHBOARD}/csv-uploads/edit`,
    },
  },
};
