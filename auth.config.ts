import { UserSettingsPlan } from '@prisma/client';
import axios from 'axios';
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env/server';
import { paths } from 'src/routes/paths';

const isTrialExpiredConfigRoute = ['dashboard', 'senders', 'profiles', 'seeds'];
export const authConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser: '/auth/register',
  },
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,

  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const currentPath = request.nextUrl.pathname;
      const isKeywordIncluded = isTrialExpiredConfigRoute.some((route) =>
        currentPath.includes(route)
      );
      if (isLoggedIn && isKeywordIncluded) {
        const { data } = await axios.get<UserSettingsPlan>(
          `${request.nextUrl.origin}/api/plan/check-plan`,
          {
            params: { email: auth.user.email },
          }
        );
        if (!data?.current_period_end) return true;
        const trial_end_date = new Date(data.current_period_end);

        console.log({ trial_end_date });

        return trial_end_date < new Date()
          ? NextResponse.redirect(new URL(paths.checkout.root, request.nextUrl.origin))
          : true;
      }
    },
  },
  providers: [],
} satisfies NextAuthConfig;
