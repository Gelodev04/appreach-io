import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';

import prisma from './db-prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
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
          const user = await prisma.userSettings.findFirst();
          console.log('user', user);
        } catch (error) {
          console.log('error', error);
        }
        console.log('credentials', credentials);
        return { id: '1', name: 'John Doe', email: 'john@outreachmagic.io' };
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
