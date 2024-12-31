import { UserSettingsPlan } from '@prisma/client';
import axios from 'axios';
import type { NextAuthConfig } from 'next-auth';
import { STRIPE } from 'src/config-global';
import { env } from 'src/data/env/server';
import { paths } from 'src/routes/paths';

const isTrialExpiredConfigRoute = ['dashboard', 'senders', 'profiles', 'seeds'];
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const currentPath = request.nextUrl.pathname;
      const isKeywordIncluded = isTrialExpiredConfigRoute.some((route) =>
        currentPath.includes(route)
      );

      if (isLoggedIn && isKeywordIncluded) {
        const url = `${request.nextUrl.origin}/api/plan/check-trial`;
        const { data } = await axios.get<UserSettingsPlan>(url, {
          params: { email: auth.user.email },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${request.headers.get('authorization')}`,
          },
        });

        if (!data?.current_period_end || data.lookup_key !== STRIPE.subscriptions.trial.key)
          return true;
        const trial_end_date = new Date(data.current_period_end);

        return trial_end_date < new Date()
          ? Response.redirect(new URL(paths.checkout.root, request.nextUrl))
          : true;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
