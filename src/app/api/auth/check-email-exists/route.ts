import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    const { email } = data;
    if (!email) throw new Error('Email is required');

    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });
    if (user) {
      throw new Error('Email is already has an account. Please use a different email or sign in');
    }

    return Response.json({ exists: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
