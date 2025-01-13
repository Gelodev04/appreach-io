import SubscriptionView from 'src/sections/subscription/view/subscription-view';
import { getCurrentPlan } from 'src/services/stripe/subscription';

export const metadata = {
  title: 'Upgrade Plan | Inbox Daddy',
};
export const dynamic = 'force-dynamic';

export default async function Page() {
  const currentSubcriptions = await getCurrentPlan();
  console.log({ currentSubcriptions });
  return <SubscriptionView subscription={currentSubcriptions} />;
}
