// ----------------------------------------------------------------------

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
    hosts: {
      root: `${ROOTS.DASHBOARD}/hosts`,
      new: `${ROOTS.DASHBOARD}/hosts/new`,
      edit: `${ROOTS.DASHBOARD}/hosts/edit`,
    },
    seeds: {
      root: `${ROOTS.DASHBOARD}/seeds`,
      new: `${ROOTS.DASHBOARD}/seeds/new`,
      edit: `${ROOTS.DASHBOARD}/seeds/edit`,
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
