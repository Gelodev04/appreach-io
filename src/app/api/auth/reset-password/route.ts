import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { sendEmail } from 'src/auth/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

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
        },
      }
    );

    // Get the current host from the request headers
    const host = request.headers.get('host');
    if (!host) throw new Error('Unable to determine the host domain');

    // Construct the reset password link using the current host
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const resetPasswordLink = `${protocol}://${host}/reset-password/${user._id}/${resetPasswordToken}`;

    // Send the reset password email
    await sendEmail(
      username,
      'Reset Password',
      `Your reset password link is: ${resetPasswordLink}`
    );

    return Response.json({
      message: 'If your email is in our database, you will receive a reset password email.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
