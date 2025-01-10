import { SeedView } from 'src/sections/seed/view';
import { getSeeds } from 'src/services/db/seeds';
import { getSeedsPlanPermissions } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Seeds | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const seedsPlanPermission = await getSeedsPlanPermissions();
  const seeds = await getSeeds();

  return <SeedView {...seedsPlanPermission} seeds={seeds} />;
}
