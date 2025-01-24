import { SeedCreateView } from 'src/sections/seed/view';
import { getUserHosts } from 'src/services/db/hosts';
import { getSeedsPlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Generate seed list | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function HostsCreatePage() {
  const hosts = await getUserHosts();
  const seedsPlanPermission = await getSeedsPlanPermissions();
  const hostOptions = hosts.map((host) => ({ label: host.host, value: host.id }));

  return (
    <SeedCreateView
      userHosts={hostOptions}
      numOfSeedsAssigned={seedsPlanPermission.numOfSeedsAssigned}
    />
  );
}
