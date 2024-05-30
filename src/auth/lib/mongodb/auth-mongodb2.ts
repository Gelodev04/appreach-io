import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { paths } from 'src/routes/paths';

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
          const db = client.db();

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

          // Update the lastLogin field with the current date
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
          };
        } catch (error) {
          console.log('error', error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn() {
      return paths.dashboard.root;
    },
  },

  events: {
    async signIn(message) {
      console.log('signIn event', message);
    },
    async signOut(message) {
      console.log('signOut event', message);
    },
  },
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
