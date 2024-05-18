// import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import NextAuth from 'next-auth';
// import { Adapter } from 'next-auth/adapters';
// import Google from 'next-auth/providers/google';
// import clientPromise from './lib/db';

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,
//   theme: {
//     logo: '/logo.png',
//   },
//   adapter: MongoDBAdapter(clientPromise) as Adapter,
//   callbacks: {
//     session({ session, user }) {
//       session.user.role = user.role;
//       return session;
//     },
//   },
//   providers: [Google],
// });
