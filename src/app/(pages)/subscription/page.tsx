import { getCurrentSubscription } from 'src/services/stripe/update-subscription';
import SubscriptionView from 'src/sections/subscription/view/subscription-view';

export const metadata = {
  title: 'Upgrade Plan | Inbox Daddy',
};
export const dynamic = 'force-dynamic';

const delay = () => new Promise((resolve) => setTimeout(resolve, 2500));

export default async function Page() {
  console.log('server waS CALL');
  await delay();
  const currentSubcriptions = await getCurrentSubscription();
  return <SubscriptionView subscription={currentSubcriptions} />;
}
