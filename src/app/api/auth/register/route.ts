import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import moment from 'moment-timezone';
import { headers } from 'next/headers';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import prisma from 'src/auth/lib/prisma/db-prisma';
import { sendEmail } from 'src/auth/lib/sendgrid';
import { TRIAL_STATUS } from 'src/config-global';
import { defaultEngagementSettings } from 'src/constants';
import { paths } from 'src/routes/paths';
import { generateApiKey } from 'src/sections/host/utils/generate-account-api-key';
import { generateUniqueAccessToken } from 'src/sections/host/utils/generate-unique-access-token';
import { generateTokenFromObjectId } from 'src/sections/host/utils/generate-userId-token';
import { createSenderAddress, getSenderByEmail } from 'src/services/db/sender-addresses';
import { createSenderDomain, getSenderByDomain } from 'src/services/db/sender-domains';
import { signupWebhook } from 'src/services/webhook/signup-hook';

interface Plan {
  customPlan: boolean;
  lookup_key?: string;
  status?: string;
  start_date?: Date;
  current_period_end?: Date;
  trial_end?: Date;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { email, password, companyName, hearAboutUs, isTrial, platforms, discountCode } = data;

    const normalizedPlatforms = platforms.split(',').map((item: string) => item.trim());

    const client = await clientPromise;
    const db = client.db();

    if (!email || !password || !companyName) {
      throw new Error('Missing required fields');
    }

    const existingUser = await db
      .collection('userSettings')
      .findOne({ 'appLogin.username': email });
    if (existingUser) throw new Error('There is already a user with the given email');

    const ipAddress = headers().get('x-forwarded-for');

    // Hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Set token expiration to 24h from now
    const tokenExpiration = addDays(new Date(), 1);

    const accountApiKey = await generateApiKey();

    // Get default looker studio URL from config collection
    const configDoc = await db.collection('config').findOne({ key: 'default_looker_studio_url' });
    const defaultLookerStudioUrl = configDoc?.value || '';

    const signupParams = {
      appLogin: {
        username: email,
        companyName,
        approved: false,
        currentLogin: null,
        lastLogin: null,
        password: hashedPassword,
        verified: false,
      },
      trackingMarketing: {
        hearAboutUs,
        ipAddress,
        platforms: normalizedPlatforms,
        discount_code: discountCode,
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
      verification: {
        lastSent: new Date().toISOString(),
        token: verificationToken,
        tokenExpiration,
        verifiedOn: null,
      },
      created: new Date(),
      lastUpdated: new Date(),
      plan: {
        customPlan: false,
      },
      planPermissionsUsed: {},
      planPermissionsAssigned: {},
      planPermissionFeatures: {},
      api: {
        token: accountApiKey,
        updated_at: new Date(),
      },
      reporting: {
        looker_studio_url: defaultLookerStudioUrl,
      },
    };

    if (isTrial) {
      signupParams.plan = {
        ...signupParams.plan,
        lookup_key: 'trial',
        status: TRIAL_STATUS.ACTIVE, // active or canceled which is also used in stripe
        start_date: new Date(),
        current_period_end: new Date(moment().add(10, 'days').toDate()),
        trial_end: new Date(moment().add(10, 'days').toDate()),
      } as Plan;
      signupParams.planPermissionsAssigned = {
        seeds: 50,
        senderProfiles: 1,
        senderAddresses: 1,
      };
      signupParams.planPermissionsUsed = {
        seeds: 0,
        senderProfiles: 0,
        senderAddresses: 0,
      };

      signupParams.planPermissionFeatures = {
        engagementMax: 50,
        scrollMessage: true,
        markImportant: true,
        removeSpam: true,
        movePrimary: true,
        clickLink: true,
        replyMessage: true,
        otherTools: false,
      };
    }

    // Create user
    const { insertedId: userId } = await db.collection('userSettings').insertOne(signupParams);

    const userIdToken = generateTokenFromObjectId(userId.toString());

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
    const defaultAccessToken = await generateUniqueAccessToken();

    // Create default host
    const { insertedId: hostId } = await db.collection('hosts').insertOne({
      host: defaultHostName,
      ownerId: userId,
      ownerName: email,
      token: {
        access: defaultAccessToken,
        lastResetAt: new Date(),
        history: [],
      },
      engagementSettings: defaultEngagementSettings.engagementSettings,
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        bigquery_sync_status: 'pending',
      },
    });

    // Update the user with the new host ObjectId
    await db.collection('userSettings').updateOne({ _id: userId }, { $set: { hosts: [hostId] } });

    await prisma.userSettings.update({
      where: {
        id: userId.toString(),
      },
      data: {
        planPermissionsUsed: {
          update: {
            senderProfiles: {
              increment: 1,
            },
          },
        },
        webhook: {
          token: userIdToken,
        },
        ownerHostId: hostId.toString(),
      },
    });

    const domain = email.split('@')[1]; // get the domain
    const isSenderDomainExist = await getSenderByDomain(domain);
    const isSenderEmailExist = await getSenderByEmail(email);

    if (!isSenderDomainExist) {
      await createSenderDomain({
        domain,
        hostId: hostId.toString(),
        isVerified: true,
        status: 'verified',
        verifiedVia: 'signup',
      });
    }

    if (!isSenderEmailExist) {
      const senderAddress = await createSenderAddress({
        email,
        hostId: hostId.toString(),
        isVerified: true,
        status: 'verified',
        verifiedVia: 'signup',
      });
      if (senderAddress) {
        await prisma.userSettings.update({
          where: {
            id: userId.toString(),
          },
          data: {
            planPermissionsUsed: {
              update: {
                senderAddresses: {
                  increment: 1,
                },
              },
            },
          },
        });
      }
    }

    // Get the current host from the request headers
    const host = headers().get('host');
    if (!host) throw new Error('Unable to determine the host domain');

    // Construct the reset password link using the current host
    const protocol = headers().get('x-forwarded-proto') || 'http';
    const url = paths.auth.verifyAccount(userId, verificationToken);
    const resetPasswordLink = `${protocol}://${host}${url}`;

    // Send verification email
    await sendEmail(
      {
        to: email,
        dynamicTemplateData: {
          subject: 'Verify email',
          headline: 'Verify email',
          message: 'Please click the button below to verify your email.',
          button_label: 'Verify email',
          button_url: resetPasswordLink,
        },
      },
      'd-c80c540d168e48ea9d9aa8e95614f541'
    );

    // Send sign up web hook
    await signupWebhook(userId.toString());

    return Response.json({ message: 'User created successfully.' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: error.statusCode || 500 });
  }
}
