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

  // Client-exposed variables (must start with NEXT_PUBLIC_)
  NEXT_PUBLIC_LIVE_LOOKER_URL: Yup.string().required(),
  NEXT_PUBLIC_SAMPLE_LOOKER_URL: Yup.string().required(),
  NEXT_PUBLIC_SALESMATE_WORKSPACE_ID: Yup.string().required(),
  NEXT_PUBLIC_SALESMATE_APP_KEY: Yup.string().required(),
  NEXT_PUBLIC_SALESMATE_TENANT_ID: Yup.string().required(),
  NEXT_PUBLIC_ASSETS_API: Yup.string(), // TODO: Is still being used?. Not found in vercel
  NEXT_PUBLIC_HOST_API: Yup.string(), // TODO: This is not currently used. Not found in vercel
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Yup.string().required(),
});

const parsedEnv = envSchema.validateSync(process.env, { abortEarly: false });

export const env = parsedEnv;
