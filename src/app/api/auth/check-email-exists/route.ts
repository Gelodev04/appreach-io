import { getUserSettingsByEmail } from 'src/services/db/user-settings';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { email } = data;
    if (!email) throw new Error('Email is required');

    const user = await getUserSettingsByEmail(data.email, {
      appLogin: { select: { username: true } },
    });

    if (user) {
      console.log({ user });
      throw new Error('Email is already has an account. Please use a different email or sign in');
    }

    return Response.json({ exists: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
