export function generateLookerStudioUrl(hostCrypts: string[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_LOOKER_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_LOOKER_URL is not defined');

  const idsString = hostCrypts.join(',');
  return baseUrl.replace('{}', idsString);
}
