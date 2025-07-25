import { env } from 'src/data/env/client';

const liveBaseUrl = env.NEXT_PUBLIC_LIVE_LOOKER_URL;

export function generateLookerStudioOld(accessToken: string[], baseUrl?: string): string {
  const effectiveBaseUrl = baseUrl || liveBaseUrl;
  if (!effectiveBaseUrl) throw new Error('Looker url is not defined');

  const idsString = accessToken.join(',');
  return effectiveBaseUrl.replaceAll('{}', idsString);
}
