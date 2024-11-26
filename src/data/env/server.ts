import * as Yup from 'yup';

const envSchema = Yup.object().shape({
  // Server-only variables
  MONGODB_URI: Yup.string().required(),
  NEXTAUTH_SECRET: Yup.string().required(),
  EMAIL_VERIFICATON_WEBHOOK: Yup.string().required(),
  INVOKER_TOKEN: Yup.string().required(),
  SENDGRID_API_TOKEN: Yup.string().required(),
  SEED_EMAIL_GENERATOR: Yup.string().required(),
  STRIPE_SECRET_KEY: Yup.string().required(),
  HOST_CRYPT_SECRET: Yup.string().required(),
});

const parsedEnv = envSchema.validateSync(process.env, { abortEarly: false });

// Export validated environment variables
export const env = parsedEnv;
