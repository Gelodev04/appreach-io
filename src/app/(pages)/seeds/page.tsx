import { SeedView } from 'src/sections/seed/view';
import { getSeeds } from 'src/services/db/seeds';

export const metadata = {
  title: 'Seeds | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const seeds = await getSeeds();

  return <SeedView seeds={seeds} />;
}
