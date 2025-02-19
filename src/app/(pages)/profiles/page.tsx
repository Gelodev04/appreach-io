import { HostListView } from 'src/sections/host/view';
import { getUserHosts } from 'src/services/db/hosts';
import { getProfilePlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Account Profiles | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const profilePlanPermission = await getProfilePlanPermissions();
  const userHosts = await getUserHosts();

  return <HostListView {...profilePlanPermission} userHosts={userHosts} />;
}
