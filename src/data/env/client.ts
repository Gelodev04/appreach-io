import * as Yup from 'yup';

const envSchema = Yup.object().shape({
  // Client-exposed variables (must start with NEXT_PUBLIC_)
  NEXT_PUBLIC_LIVE_LOOKER_URL: Yup.string(),
  NEXT_PUBLIC_SAMPLE_LOOKER_URL: Yup.string(),
  NEXT_PUBLIC_SALESMATE_WORKSPACE_ID: Yup.string(),
  NEXT_PUBLIC_SALESMATE_APP_KEY: Yup.string(),
  NEXT_PUBLIC_SALESMATE_TENANT_ID: Yup.string(),
  NEXT_PUBLIC_ASSETS_API: Yup.string(), // TODO: Is still being used?. Not found in vercel
  NEXT_PUBLIC_HOST_API: Yup.string(), // TODO: This is not currently used. Not found in vercel
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Yup.string(),
});

const parsedEnv = envSchema.validateSync(
  {
    NEXT_PUBLIC_LIVE_LOOKER_URL: process.env.NEXT_PUBLIC_LIVE_LOOKER_URL,
    NEXT_PUBLIC_SAMPLE_LOOKER_URL: process.env.NEXT_PUBLIC_SAMPLE_LOOKER_URL,
    NEXT_PUBLIC_SALESMATE_WORKSPACE_ID: process.env.NEXT_PUBLIC_SALESMATE_WORKSPACE_ID,
    NEXT_PUBLIC_SALESMATE_APP_KEY: process.env.NEXT_PUBLIC_SALESMATE_APP_KEY,
    NEXT_PUBLIC_SALESMATE_TENANT_ID: process.env.NEXT_PUBLIC_SALESMATE_TENANT_ID,
    NEXT_PUBLIC_ASSETS_API: process.env.NEXT_PUBLIC_ASSETS_API, // TODO: Is still being used?. Not found in vercel
    NEXT_PUBLIC_HOST_API: process.env.NEXT_PUBLIC_HOST_API, // TODO: This is not currently used. Not found in vercel
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  { abortEarly: false }
);

// Export validated environment variables
export const env = parsedEnv;
