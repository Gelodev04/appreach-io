import { UserSettingsPlan } from '@prisma/client';
import { authConfig } from 'auth.config';
import axios from 'axios';
import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();
  if (session) {
    const { user } = session;
    const url = `${nextUrl.origin}/api/plan/check-trial`;
    console.log({ headers: request.headers });
    const { data } = await axios.get<UserSettingsPlan>(url, {
      params: { email: user.email },
    });

    console.log({ session, data });
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
