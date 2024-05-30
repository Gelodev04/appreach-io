import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const userSettings = await db
      .collection('userSettings')
      .findOne({ 'appLogin.username': 'michael@outreachmagic.io' });

    if (!userSettings) {
      throw { message: 'No user found with the provided username.', statusCode: 404 };
    }

    if (!userSettings.lookerStudio) {
      throw {
        message:
          'No lookerStudio settings found for the user. Please ensure the user has the necessary settings configured.',
        statusCode: 404,
      };
    }

    return Response.json({ embedUrl: userSettings.lookerStudio.embedUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
