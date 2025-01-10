import { Typography } from '@mui/material';
import { SeedCreateView } from 'src/sections/seed/view';
import { getSeedsPlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Generate seed list | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function HostsCreatePage() {
  const seedsPlanPermission = await getSeedsPlanPermissions();

  if (seedsPlanPermission.isAllSeedsUsed) {
    // TODO: Add upgrade plan link
    return <Typography>Upgrade your plan to add more seeds</Typography>;
  }
  return <SeedCreateView />;
}
