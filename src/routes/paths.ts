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
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
    },
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
  },
};
