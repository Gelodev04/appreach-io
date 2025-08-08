import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { sendEmail } from 'src/auth/lib/sendgrid';
import { paths } from 'src/routes/paths';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      throw new Error('Email is required');
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the user by email
    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already verified
    if (user.appLogin.verified) {
      throw new Error('Email is already verified');
    }

    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Set token expiration to 24h from now
    const tokenExpiration = addDays(new Date(), 1);

    // Update user with new verification token
    await db.collection('userSettings').updateOne(
      { _id: user._id },
      {
        $set: {
          'verification.token': verificationToken,
          'verification.tokenExpiration': tokenExpiration,
          'verification.lastSent': new Date().toISOString(),
          lastUpdated: new Date(),
        },
      }
    );

    // Get the current host from the request headers
    const host = headers().get('host');
    if (!host) throw new Error('Unable to determine the host domain');

    // Construct the verification link using the current host
    const protocol = headers().get('x-forwarded-proto') || 'http';
    const url = paths.auth.verifyAccount(user._id, verificationToken);
    const verificationLink = `${protocol}://${host}${url}`;

    // Send verification email
    await sendEmail(
      {
        to: email,
        dynamicTemplateData: {
          first_name: email,
          subject: 'Verify email',
          headline: 'Verify email',
          message: 'Please click the button below to verify your email.',
          button_label: 'Verify email',
          button_url: verificationLink,
        },
      },
      'd-c80c540d168e48ea9d9aa8e95614f541'
    );

    return Response.json({
      message: 'Verification email sent successfully. Please check your email.',
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: error.statusCode || 500 });
  }
}
