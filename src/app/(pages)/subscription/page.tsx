import SubscriptionView from 'src/sections/subscription/view/subscription-view';
import { getCurrentPlan } from 'src/services/stripe/subscription';

export const metadata = {
  title: 'Upgrade Plan | Inbox Daddy',
};
export const dynamic = 'force-dynamic';

const delay = () => new Promise((resolve) => setTimeout(resolve, 2500));

export default async function Page() {
  await delay();
  const currentSubcriptions = await getCurrentPlan();
  return <SubscriptionView subscription={currentSubcriptions} />;
}
