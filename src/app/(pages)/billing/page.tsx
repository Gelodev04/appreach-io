import SubscriptionView from 'src/sections/subscription/view/subscription-view';
import { getUserSettings } from 'src/services/db/user-settings';
import { getCurrentPlan } from 'src/services/stripe/subscription';

export const metadata = {
  title: 'Upgrade Plan | Outreach Magic',
};
export const dynamic = 'force-dynamic';

export default async function Page() {
  const currentSubcriptions = await getCurrentPlan();
  const { appLogin } = await getUserSettings({ appLogin: { select: { username: true } } });

  return <SubscriptionView subscription={currentSubcriptions} username={appLogin.username} />;
}
