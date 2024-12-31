import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PATH_AFTER_LOGIN, TRIAL_STATUS } from 'src/config-global';
import { env } from 'src/data/env/server';

import clientPromise from './db-mongo';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser: '/auth/register',
  },
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
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
          const db = client.db();
          const user = await db
            .collection('userSettings')
            .findOne({ 'appLogin.username': credentials.email });

          if (!credentials.password || !credentials.email) {
            throw new Error('No credentials provided');
          }

          if (!user) throw new Error('No user found');

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.appLogin.password
          );

          if (!isValidPassword) throw new Error('Invalid password');

          await db.collection('userSettings').updateOne(
            { 'appLogin.username': credentials.email },
            {
              $set: {
                'appLogin.lastLogin': new Date().toISOString(),
                'appLogin.currentLogin': new Date().toISOString(),
              },
            }
          );

          return {
            id: user._id.toString(),
            email: user.appLogin.username,
            role: user.appLogin.view,
            verified: user.appLogin.verified,
          };
        } catch (error) {
          console.log(error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const client = await clientPromise;
      const db = client.db();
      const user: any = await db
        .collection('userSettings')
        .findOne({ 'appLogin.username': session.user.email });

      const { plan } = user;
      if (plan.current_period_end < new Date()) {
        await db.collection('userSettings').updateOne(
          { _id: user._id },
          {
            $set: {
              'plan.status': TRIAL_STATUS.CANCELED, // Update the status
            },
          }
        );

        console.log('Trial period has been cancelled.');
      }

      session.user.id = user._id as string;
      session.user.firstName = user.appLogin.firstName;
      session.user.lastName = user.appLogin.lastName;
      session.user.phone = user.appLogin.phone;
      return session;
    },

    // Redirect after successful sign in
    async redirect({ baseUrl }) {
      return `${baseUrl}${PATH_AFTER_LOGIN}`;
    },

    // Allow sign in if user has been verified
    async signIn({ user }) {
      return user?.verified || false;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      phone: string;
    };
    accessToken?: string;
  }

  interface User {
    role?: string;
    verified?: boolean;
  }
}
