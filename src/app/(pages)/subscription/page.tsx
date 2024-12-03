import { Suspense } from 'react';
import { getCurrentSubscription } from 'src/services/stripe/update-subscription';
import dynamic from 'next/dynamic';
import SkeletonSubscription from './_component/skeleton-subcription';

export const metadata = {
  title: 'Upgrade Plan | Inbox Daddy',
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 2500));

const SubscriptionView = dynamic(() => import('src/sections/subscription/view/subscription-view'), {
  loading: () => <SkeletonSubscription />,
  ssr: true,
});

export default async function Page() {
  console.log('server waS CALL');
  await delay();
  const currentSubcriptions = await getCurrentSubscription();
  return (
    <Suspense fallback={<SkeletonSubscription />}>
      <SubscriptionView subscription={currentSubcriptions} />
    </Suspense>
  );
}
