import { HostSkeleton } from 'src/sections/host/host-skeleton';
import { getHostById } from 'src/services/db/hosts';
import { HostContainer } from './_components/host-container';
import { HostErrorComponent } from './_components/host-error-component';

export const metadata = {
  title: 'Edit sender profile | Inbox Daddy',
};

export default async function HostsEditPage({ params }: { params: { hostId: string } }) {
  const hostLoading = false;
  const { hostId } = params;
  const { host, error } = await getHostById(hostId);

  if (error) return <HostErrorComponent status={error.status} message={error.message} />;

  //add loading
  if (hostLoading) return <HostSkeleton />;

  console.log({ currentItemParams: host });

  return <HostContainer host={host} />;
}
