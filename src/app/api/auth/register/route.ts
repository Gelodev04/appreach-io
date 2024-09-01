import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, firstName, lastName } = data;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    if (!email || !password || !firstName || !lastName) throw new Error('Missing required fields');

    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });
    if (user) throw new Error('There is already a user with the given email');

    // Hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Set token expiration to 24h from now
    const tokenExpiration = addDays(new Date(), 1);

    await db.collection('userSettings').insertOne({
      appLogin: {
        username: email,
        approved: false,
        currentLogin: null,
        lastLogin: null,
        password: hashedPassword,
        verified: false,
        view: 'inboxPlacementAudit',
      },
      approval: {
        lastSent: null,
        token: null,
        tokenExpiration: null,
        verifiedOn: null,
      },
      hosts: [],
      resetPassword: {
        lastReset: null,
        token: null,
        tokenExpiration: null,
      },
      seeds: {},
      verification: {
        lastSent: new Date().toISOString(),
        token: verificationToken,
        tokenExpiration,
        verifiedOn: null,
      },
    });

    // Send verification email here

    throw new Error('Not implemented yet');

    return Response.json({ message: 'User created successfully.' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: error.statusCode || 500 });
  }
}
