import { getUser } from 'src/auth/lib/mongodb/get-user';

export async function GET() {
  try {
    const userSettings = await getUser();

    if (!userSettings.lookerStudio) {
      return Response.json({
        embedUrl: `${process.env.SAMPLE_LOOKER_URL}`,
        warningMessage:
          'Important: Your dashboard is currently displaying sample data. This will be replaced with real data once you begin sending emails.',
      });
    }

    return Response.json({ embedUrl: userSettings.lookerStudio.embedUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
