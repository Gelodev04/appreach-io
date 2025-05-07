import { SharableLayout } from './_components/sharable-layout';
import { SharableLookerStudio } from './_components/sharable-looker-studio';

export const metadata = {
  title: 'Dashboard overview | Outreach Magic',
};

export default async function SharablePage({ params }: { params: { access_token: string } }) {
  const { access_token } = params;

  return (
    <SharableLayout>
      <SharableLookerStudio accessToken={access_token} />
    </SharableLayout>
  );
}
