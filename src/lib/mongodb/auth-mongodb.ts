import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import clientPromise from './db-mongo';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email:',
          type: 'text',
        },
        password: {
          label: 'password:',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db() as any;

          const users = await db.collection('userSettings').findMany();
          console.log('users', users);
        } catch (error) {
          console.log('error', error);
        }
        console.log('credentials', credentials);
        return null;
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
