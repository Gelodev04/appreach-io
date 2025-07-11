import { getUserSettings, updateUserSettings } from 'src/services/db/user-settings';

export async function POST(request: Request) {
  try {
    const { value, newValue } = await request.json();

    const { webhook } = await getUserSettings({ webhook: true });

    const updatedNotifyOnDisconnect = {
      ...webhook.notify_on_disconnect,
      [value]: newValue,
    };

    const response = await updateUserSettings(
      {
        webhook: {
          ...webhook,
          notify_on_disconnect: updatedNotifyOnDisconnect,
        },
      },
      { webhook: true }
    );

    if (response.success) {
      return Response.json({ success: true });
    }

    return Response.json(
      {
        success: false,
        message: response.message || 'Failed to update webhook notification setting',
      },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: 'Failed to save due to an error.' },
      { status: 500 }
    );
  }
}
