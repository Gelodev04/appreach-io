import NextAuth from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

// import clientPromise from 'src/auth/lib/mongodb';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOption: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  //   adapter: MongoDBAdapter(clientPromise),
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOption);

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
