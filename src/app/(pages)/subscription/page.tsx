import SubscriptionView from 'src/sections/subscription/view/subscription-view';
import { getCurrentSubscription } from 'src/services/stripe/update-subscription';

export const metadata = {
  title: 'Upgrade Plan | Inbox Daddy',
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 2000));

export default async function Page() {
  await delay();
  const currentSubcriptions = await getCurrentSubscription();
  return <SubscriptionView subscription={currentSubcriptions} />;
}
