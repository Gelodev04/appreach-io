import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { paths } from 'src/routes/paths';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
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
