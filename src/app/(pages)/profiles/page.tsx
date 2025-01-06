import HostListView from 'src/sections/host/view/sender-list-view';
import { getProfilePlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Sender Profiles | Inbox Daddy',
};

export default async function Page() {
  const profilePlanPermission = await getProfilePlanPermissions();

  console.log({ profilePlanPermission });

  return <HostListView {...profilePlanPermission} />;
}
