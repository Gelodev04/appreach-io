import { paths } from 'src/routes/paths';
import { env } from './data/env';

// API
// --------------------------------------------------------------------

export const {
  MONGODB_URI,
  NEXT_PUBLIC_HOST_API: HOST_API,
  NEXT_PUBLIC_ASSETS_API: ASSETS_API,
} = env;
console.log({ MONGODB_URI });
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
      price: 150,
      order: 1,
    },
    established: {
      key: 'established',
      name: 'Established',
      product: 'prod_R0TQY0ijWzmt5N',
      priceId: 'price_1Q8STNIPvbQKS9UKjq8eHJh2',
      price: 650,
      order: 2,
    },
  },
};
