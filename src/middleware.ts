import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { UserSettingsPlan } from '@prisma/client';
import NextAuth from 'next-auth';
import { authConfig } from 'auth.config';
import { env } from './data/env/server';
import { paths } from './routes/paths';

const isTrialExpiredConfigRoute = ['dashboard', 'senders', 'profiles', 'seeds'];

export default NextAuth(authConfig).auth;

export async function middleware(req: NextRequest) {
  console.log('Request Headers:', req.headers); // Log request headers
  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET! });
  console.log('Token:', token);
  const userId = token?.sub; // Extract user ID from the token (assuming 'sub' contains the user ID)
  const currentPath = req.nextUrl.pathname;
  const isKeywordIncluded = isTrialExpiredConfigRoute.some((route) => currentPath.includes(route));
  console.log({ userId, currentPath, isKeywordIncluded, origin: req.nextUrl.origin });
  if (userId && isKeywordIncluded) {
    const { data } = await axios.get<UserSettingsPlan>(
      `${req.nextUrl.origin}/api/plan/check-plan`,
      {
        params: { id: userId },
      }
    );

    if (!data?.current_period_end) return NextResponse.next();

    const trial_end_date = new Date(data.current_period_end);
    if (trial_end_date < new Date())
      return NextResponse.redirect(new URL(paths.checkout.root, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
