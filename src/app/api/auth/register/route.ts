import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { sendEmail } from 'src/auth/lib/sendgrid';
import { paths } from 'src/routes/paths';
import { generateHostCrypt, generateLookerStudioUrl } from 'src/sections/host/utils';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      companyName,
      phoneNumber,
      hearAboutUs,
      emailsSendsPerDay,
      callRequested,
    } = data;

    const client = await clientPromise;
    const db = client.db();

    if (!email || !password || !firstName || !lastName || !companyName) {
      throw new Error('Missing required fields');
    }

    const existingUser = await db
      .collection('userSettings')
      .findOne({ 'appLogin.username': email });
    if (existingUser) throw new Error('There is already a user with the given email');

    // Hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Set token expiration to 24h from now
    const tokenExpiration = addDays(new Date(), 1);

    // Create user
    const { insertedId: userId } = await db.collection('userSettings').insertOne({
      appLogin: {
        username: email,
        firstName,
        lastName,
        companyName,
        phone: phoneNumber,
        approved: false,
        currentLogin: null,
        lastLogin: null,
        password: hashedPassword,
        verified: false,
        view: 'inboxPlacementAudit',
      },
      trackingMarketing: {
        hearAboutUs,
        emailsSendsPerDay,
        callRequested,
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

    // Generate a unique host name
    const generateUniqueHostName = async (
      baseHostName: string,
      counter: number = 1
    ): Promise<string> => {
      // Check if a host with the same name exists in the 'hosts' collection
      const hostName = counter === 1 ? baseHostName : `${baseHostName}${counter}`;
      const hostExists = await db.collection('hosts').findOne({ host: hostName });

      // If host exists, call this function recursively with an incremented counter
      if (hostExists) return generateUniqueHostName(baseHostName, counter + 1);

      return hostName;
    };

    const baseHostName = companyName.toLowerCase().replace(/\s+/g, '');
    const defaultHostName = await generateUniqueHostName(baseHostName);
    const defaultHostCrypt = generateHostCrypt(defaultHostName);
    const defaultHostLookerStudioUrl = generateLookerStudioUrl([defaultHostCrypt]);

    // Create default host
    const { insertedId: hostId } = await db.collection('hosts').insertOne({
      host: defaultHostName,
      hostCrypt: defaultHostCrypt,
      userSettings: {
        timezone: '',
        externalSenderAddresses: [],
        notificationAddressArray: [],
      },
      lookerStudio: { embedUrl: defaultHostLookerStudioUrl, hasToRegenerate: false },
      inboxEngagement: {
        markImportant: true,
        removeSpam: true,
        replyMessage: false,
        clickLink: true,
        downloadMessage: true,
        movePrimary: true,
        scrollMessage: true,
      },
    });

    // Update the user with the new host ObjectId
    await db.collection('userSettings').updateOne({ _id: userId }, { $set: { hosts: [hostId] } });

    // Get the current host from the request headers
    const host = request.headers.get('host');
    if (!host) throw new Error('Unable to determine the host domain');

    // Construct the reset password link using the current host
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const url = paths.auth.verifyAccount(userId, verificationToken);
    const resetPasswordLink = `${protocol}://${host}${url}`;

    // Send verification email
    await sendEmail(
      {
        to: email,
        dynamicTemplateData: {
          first_name: firstName,
          subject: 'Verify email',
          headline: 'Verify email',
          message: 'Please click the button below to verify your email.',
          button_label: 'Verify email',
          button_url: resetPasswordLink,
        },
      },
      'd-c80c540d168e48ea9d9aa8e95614f541'
    );

    return Response.json({ message: 'User created successfully.' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: error.statusCode || 500 });
  }
}
