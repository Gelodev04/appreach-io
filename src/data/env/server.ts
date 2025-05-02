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
  SIGNUP_WEBHOOK: Yup.string(),
  EMAIL_VALIDATOR_FUNCTION: Yup.string(),
  ATTRIBUTE_UPLOADS_FUNCTION: Yup.string(),
  SMARTLEAD_ACCOUNTS_FUNCTION: Yup.string(),
  REPROCESS_SENDERS_FUNCTION: Yup.string(),
  G_SERVICE_ACCOUNT_KEY: Yup.string(),
  G_PROJECT_ID: Yup.string(),
  G_BUCKET_NAME_EMAIL_VALIDATOR: Yup.string(),
  HUBSPOT_CLIENT_ID: Yup.string(),
  HUBSPOT_REDIRECT_URI: Yup.string(),
  HUBSPOT_OAUTH_FUNCTION: Yup.string(),
});
const parsedEnv = envSchema.validateSync(process.env, { abortEarly: false });

// Export validated environment variables
export const env = parsedEnv;
