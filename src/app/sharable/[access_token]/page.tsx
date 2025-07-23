import { checkIfTokenExist } from 'src/services/db/hosts';
import { SharableLayout } from './_components/sharable-layout';
import { SharableLookerStudio } from './_components/sharable-looker-studio';
import { TokenNotFound } from './_components/token-not-found';
import { getConfigDropdownOptions } from 'src/services/db/config';

export const metadata = {
  title: 'Dashboard overview | Outreach Magic',
};

export default async function SharablePage({ params }: { params: { access_token: string } }) {
  const { access_token } = params;
  const { success, exists } = await checkIfTokenExist(access_token);
  const sharableLookerStudioUrl = await getConfigDropdownOptions({
    key: 'shareble_looker_studio_url',
  });

  const findMatchingLookerStudioUrl = (accessToken: string, config: any) => {
    // Add null checks to prevent errors
    if (!config || !Array.isArray(config)) return;

    // Decode the URL-encoded access token (commas become %2C in URLs)
    const decodedAccessToken = decodeURIComponent(accessToken);

    // First, try to find an exact match comparing the whole token string
    const matchingEntry = config.find((entry: any) => entry.token === decodedAccessToken);

    if (matchingEntry) {
      return matchingEntry.looker_studio_url;
    }

    // If no match found, use default
    const defaultEntry = config.find((entry: any) => entry.token === 'default');
    return defaultEntry?.looker_studio_url;
  };

  if (success) {
    if (exists) {
      // Find the appropriate Looker Studio URL based on token matching
      const baseUrl = findMatchingLookerStudioUrl(access_token, sharableLookerStudioUrl);
      return (
        <SharableLayout>
          <SharableLookerStudio accessToken={access_token} defaultLookerStudioUrl={baseUrl} />
        </SharableLayout>
      );
    }

    return <TokenNotFound />;
  }

  return null;
}
