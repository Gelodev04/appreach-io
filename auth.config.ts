import type { NextAuthConfig } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { env } from 'src/data/env/server';

const isTrialExpiredConfigRoute = ['dashboard', 'senders', 'profiles', 'seeds'];
export const authConfig = {
  callbacks: {
    async authorized({ auth, request }) {
      console.log({ id: auth?.user.id });
      const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET as string });
      console.log({ token });
      const isLoggedIn = !!auth?.user;

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
