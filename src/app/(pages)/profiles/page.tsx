import HostListView from 'src/sections/host/view/sender-list-view';
import { getUserHosts } from 'src/services/db/hosts';
import { getProfilePlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Sender Profiles | Inbox Daddy',
};

export default async function Page() {
  const profilePlanPermission = await getProfilePlanPermissions();
  const userHosts = await getUserHosts();

  console.log({ profilePlanPermission, userHosts });

  return <HostListView {...profilePlanPermission} userHosts={userHosts} />;
}
