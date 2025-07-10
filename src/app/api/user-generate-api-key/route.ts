import { generateApiKey } from 'src/sections/host/utils/generate-account-api-key';
import { getUserSettings, updateUserSettings } from 'src/services/db/user-settings';

export async function POST() {
  try {
    const apiKey = await generateApiKey();

    const { api } = await getUserSettings({ api: true });

    const response = await updateUserSettings(
      {
        api: {
          token: apiKey,
          updated_at: new Date(),
          webhook: api?.webhook || {},
        },
      },
      { api: true }
    );

    if (response.success) {
      return Response.json({ success: true, apiKey });
    }

    return Response.json(
      { success: false, message: response.message || 'Failed to regenerate API key' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: 'Failed to save due to an error.' },
      { status: 500 }
    );
  }
}
