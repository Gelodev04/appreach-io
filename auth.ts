import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { authConfig } from './auth.config';

async function getUser(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });
    if (!user) {
      throw new Error('No user found');
    }

    return {
      id: user._id.toString(),
      email: user.appLogin.username,
      password: user.appLogin.password,
      verified: user.appLogin.verified,
    };
  } catch (error) {
    // Do nothing
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUser(credentials.email as string);

        if (user) {
          return {
            id: user.id,
            email: user.email,
            verified: user.verified,
          };
        }

        return null;
      },
    }),
  ],
});
