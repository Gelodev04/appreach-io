## NODE.JS

- Node 16.x || 18.x

## USING YARN (Recommend)

- yarn install
- yarn dev

## USING NPM

- npm i OR npm i --legacy-peer-deps
- npm run dev

## Environment Variables

`MONGODB_URI=""`

> The connection string for the MongoDB database. This URI includes the username, password, cluster address, and default database.

`MONGODB_DATABASE=""`

> Specifies the name of the MongoDB database to use within the application. (e.g., sandbox or v4)

`SEED_EMAIL_GENERATOR=""`

> The URL endpoint for the Seed Emails Generator Cloud Function. This function is used to generate seed emails.

`NEXTAUTH_SECRET=""`

> A secret key used by NextAuth.js to encrypt session data and generate tokens.

`NEXT_PUBLIC_LOOKER_URL=""`

> The public URL used to embed Looker Studio reports within the application.

`SENDGRID_API_TOKEN=""`

> The API token for SendGrid, used for sending emails from your application.

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""`

> The publishable (public) key for Stripe, used on the client side to process payments.

`STRIPE_SECRET_KEY=""`

> The secret key for Stripe, used on the server side to process payments securely.
