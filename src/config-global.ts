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
      key: 'starter',
      name: 'Starter',
      product: 'prod_Qs8dSFvQyCKZuL',
      priceId: 'price_1Q0OMZIPvbQKS9UKZ3h12FoK',
      price: '$150',
    },
    established: {
      key: 'established',
      name: 'Established',
      product: 'prod_R0TQY0ijWzmt5N',
      priceId: 'price_1Q8STNIPvbQKS9UKjq8eHJh2',
      price: '$650',
    },
  },
};
