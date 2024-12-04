import * as Yup from 'yup';

const envSchema = Yup.object().shape({
  // Server-only variables
  MONGODB_URI: Yup.string(),
  NEXTAUTH_SECRET: Yup.string(),
  VERIFY_SENDERS_FUNCTION: Yup.string(),
  INVOKER_TOKEN: Yup.string(),
  SENDGRID_API_TOKEN: Yup.string(),
  SEED_EMAIL_GENERATOR: Yup.string(),
  STRIPE_SECRET_KEY: Yup.string(),
  HOST_CRYPT_SECRET: Yup.string(),
});

const parsedEnv = envSchema.validateSync(process.env, { abortEarly: false });

// Export validated environment variables
export const env = parsedEnv;
