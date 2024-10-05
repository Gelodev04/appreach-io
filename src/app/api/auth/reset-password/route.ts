import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { sendEmail } from 'src/auth/lib/sendgrid';
import { paths } from 'src/routes/paths';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const username = data.email;
    if (!username) throw new Error('Email is required');

    const user = await db.collection('userSettings').findOne({ 'appLogin.username': username });
    if (!user) throw new Error('Could not find any user with the given email');

    // Generate a new reset token
    const resetPasswordToken = randomBytes(32).toString('hex');

    // Set token expiration to 24h from now
    const tokenExpiration = addDays(new Date(), 1);

    await db.collection('userSettings').updateOne(
      { 'appLogin.username': username },
      {
        $set: {
          'resetPassword.token': resetPasswordToken,
          'resetPassword.tokenExpiration': tokenExpiration,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    // Get the current host from the request headers
    const host = request.headers.get('host');
    if (!host) throw new Error('Unable to determine the host domain');

    // Construct the reset password link using the current host
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const url = paths.auth.resetPassword(user._id, resetPasswordToken);
    const resetPasswordLink = `${protocol}://${host}${url}`;

    // Send the reset password email
    await sendEmail(
      {
        to: username,
        dynamicTemplateData: {
          first_name: username,
          subject: 'Reset password',
          headline: 'Reset password',
          message: 'Please click the button below to reset your password.',
          button_label: 'Reset password',
          button_url: resetPasswordLink,
        },
      },
      'd-c80c540d168e48ea9d9aa8e95614f541'
    );

    return Response.json({
      message: 'If your email is in our database, you will receive a reset password email.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
