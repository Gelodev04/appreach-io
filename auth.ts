import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';
// import bcrypt from 'bcrypt';

async function getUser(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });
    if (!user) {
      throw new Error('No user found');
    }

    return {
      id: user._id.toString(),
      email: user.appLogin.username,
      password: user.appLogin.password,
    };
  } catch (error) {}
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await getUser(credentials.email as string);

        if (user) return user;

        return null;

        // if (user && (await bcrypt.compare(credentials.password as string, user.password))) {
        //   return user;
        // } else {
        //   return null;
        // }
      },
    }),
  ],
});
