import { checkIfTokenExist } from 'src/services/db/hosts';
import { SharableLayout } from './_components/sharable-layout';
import { SharableLookerStudio } from './_components/sharable-looker-studio';
import { TokenNotFound } from './_components/token-not-found';

export const metadata = {
  title: 'Dashboard overview | Outreach Magic',
};

export default async function SharablePage({ params }: { params: { access_token: string } }) {
  const { access_token } = params;
  const { success, exists } = await checkIfTokenExist(access_token);

  if (success) {
    if (exists) {
      return (
        <SharableLayout>
          <SharableLookerStudio accessToken={access_token} />
        </SharableLayout>
      );
    }

    return <TokenNotFound />;
  }

  return null;
}
