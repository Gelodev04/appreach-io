import { getUserSettings, updateUserSettings } from 'src/services/db/user-settings';

export async function POST(request: Request) {
  try {
    const { notification_email } = await request.json();

    const { webhook } = await getUserSettings({ webhook: true });

    const response = await updateUserSettings(
      {
        webhook: {
          ...webhook,
          notification_email,
        },
      },
      { webhook: true }
    );

    if (response.success) {
      return Response.json({ success: true });
    }

    return Response.json(
      { success: false, message: response.message || 'Failed to update notification email' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: 'Failed to update notification email due to an error.' },
      { status: 500 }
    );
  }
}
