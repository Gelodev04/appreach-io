import { paths } from 'src/routes/paths';

// API
// --------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const { DATABASE_URL } = process.env;
export const { MONGODB_URI_PROD, MONGODB_URI_TEST } = process.env;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;

// STRIPE
export const STRIPE = {
  prices: {
    starter: 'price_1Q0OMZIPvbQKS9UKZ3h12FoK',
    established: 'price_1Q0ONHIPvbQKS9UKRm2Z1neZ',
  },
};
