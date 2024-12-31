import { UserSettingsPlan } from '@prisma/client';
import axios from 'axios';
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
      console.log({ id: auth?.user.id });
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
