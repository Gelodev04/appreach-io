import { SeedCreateView } from 'src/sections/seed/view';
import { getSeedsPlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Generate seed list | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function HostsCreatePage() {
  const seedsPlanPermission = await getSeedsPlanPermissions();

  return <SeedCreateView numOfSeedsAssigned={seedsPlanPermission.numOfSeedsAssigned} />;
}
