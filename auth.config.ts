import type { NextAuthConfig } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { env } from 'src/data/env/server';
import { getUserSettingsByEmail } from 'src/services/db/user-settings';

const isTrialExpiredConfigRoute = ['dashboard', 'senders', 'profiles', 'seeds'];
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET! });
      console.log({ token });
      const isLoggedIn = !!auth?.accessToken?.substring;

      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
