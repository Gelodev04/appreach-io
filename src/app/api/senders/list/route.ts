import { getUser } from 'src/auth/lib/mongodb/get-user';

export async function GET() {
  try {
    const userSettings = await getUser();

    if (!userSettings.hosts || userSettings.hosts.length === 0) {
      return Response.json(
        {
          error:
            'No senders details found for the user. Please ensure the user has the necessary hosts configured.',
        },
        { status: 400 }
      );
    }

    const { senders } = userSettings;

    return Response.json({ senders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
