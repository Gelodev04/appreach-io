import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import clientPromise from './db-mongo';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          type: 'text',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;

          const db = client.db(process.env.MONGODB_DATABASE || undefined);
          const user = await db
            .collection('userSettings')
            .findOne({ 'appLogin.username': credentials.email });

          if (!credentials.password || !credentials.email) {
            throw new Error('No credentials provided');
          }

          if (!user) {
            throw new Error('No user found');
          }

          const isValidPassword = await bcrypt.compare(
             credentials.password as string,
             user.appLogin.password
          );

          if (!isValidPassword) {
             throw new Error('Invalid password');
          }

          await db.collection('userSettings').updateOne(
            { 'appLogin.username': credentials.email },
            {
              $set: {
                'appLogin.lastLogin': new Date(),
                'appLogin.currentLogin': new Date(),
              },
            }
          );

          return {
            id: user._id.toString(),
            email: user.appLogin.username,
            role: user.appLogin.view,
          };
        } catch (error) {
          console.log(error.message);
          return null;
        }
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
    };
    accessToken?: string;
  }
}
