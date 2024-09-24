import { MONGODB_URI_PROD, MONGODB_URI_TEST } from 'src/config-global';

export function getMongoUri() {
  if (!MONGODB_URI_PROD || !MONGODB_URI_TEST) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (process.env.NODE_ENV === 'production') return MONGODB_URI_PROD;
  return MONGODB_URI_TEST;
}
