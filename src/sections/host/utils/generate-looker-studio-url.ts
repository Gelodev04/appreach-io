export function generateLookerStudioUrl(hostCryptIds: string[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_LOOKER_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_LOOKER_URL is not defined');

  const idsString = hostCryptIds.join(',');
  return baseUrl.replace('{}', idsString);
}
