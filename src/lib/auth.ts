import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { paths } from 'src/routes/paths';

import { connectDB } from './dbConnect';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/register',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectDB();
        console.log('credentials', credentials);
        return { id: '1', name: 'test', email: 'michael@outreach.io' };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return paths.dashboard.root; // replace with your actual path
    },
  },
});
