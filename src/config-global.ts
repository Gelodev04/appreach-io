import { paths } from 'src/routes/paths';

// API
// --------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const { DATABASE_URL } = process.env;
export const { MONGODB_URI } = process.env;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;

// STRIPE
export const STRIPE = {
  subscriptions: {
    starter: {
      name: 'Starter',
      product: 'prod_Qs8dSFvQyCKZuL',
      price: 'price_1Q0OMZIPvbQKS9UKZ3h12FoK',
    },
    established: {
      name: 'Established',
      product: 'prod_R0TQY0ijWzmt5N',
      price: 'price_1Q8STNIPvbQKS9UKjq8eHJh2',
    },
  },
};
