import { getUser } from 'src/auth/lib/mongodb/get-user';

export async function GET() {
  try {
    const userSettings = await getUser()

    if (!userSettings.lookerStudio) {
      return Response.json({ error: 'No lookerStudio settings found for the user. Please ensure the user has the necessary settings configured.' }, { status: 500 });
    }

    return Response.json({ embedUrl: userSettings.lookerStudio.embedUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
