import { Typography } from '@mui/material';
import { SeedView } from 'src/sections/seed/view';
import { getSeeds } from 'src/services/db/seeds';
import { getSeedsPlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Seeds | Inbox Daddy',
};

export default async function Page() {
  const seedsPlanPermission = await getSeedsPlanPermissions();
  const seeds = await getSeeds();

  if (seedsPlanPermission.isAllSeedsUsed) {
    // TODO: Add upgrade plan link
    return <Typography>Upgrade your plan to add more seeds</Typography>;
  }

  console.log({ seedsPlanPermission, seeds });

  return <SeedView {...seedsPlanPermission} seeds={seeds} />;
}
