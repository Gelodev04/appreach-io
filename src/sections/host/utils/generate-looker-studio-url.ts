import { getUserSettings } from 'src/services/db/user-settings';

export async function generateLookerStudioUrl(
  accessToken: string[],
  baseUrl?: string
): Promise<string> {
  if (baseUrl) {
    const idsString = accessToken.join(',');
    return baseUrl.replaceAll('{}', idsString);
  }

  const { reporting } = await getUserSettings({ reporting: true });
  const effectiveBaseUrl = reporting?.looker_studio_url;
  if (!effectiveBaseUrl) throw new Error('Looker Studio URL is not defined in user settings');

  const idsString = accessToken.join(',');
  return effectiveBaseUrl.replaceAll('{}', idsString);
}
