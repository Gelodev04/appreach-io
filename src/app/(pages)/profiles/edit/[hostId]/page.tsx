import { getHostById } from 'src/services/db/hosts';
import { HostContainer } from './_components/host-container';

export const metadata = {
  title: 'Edit sender profile | Inbox Daddy',
};

export default async function HostsEditPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const { host } = await getHostById(hostId);

  console.log({ currentItemParams: host });

  return <HostContainer host={host} />;
}
