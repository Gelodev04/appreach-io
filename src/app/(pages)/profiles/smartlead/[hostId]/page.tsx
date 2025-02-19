import { HostSmartleadView } from 'src/sections/host/view/host-smartlead-view';
import { getHostById } from 'src/services/db/hosts';

export const metadata = {
  title: 'Edit smartlead settings | Outreach Magic',
};

export default async function HostsEditPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const host = await getHostById(hostId);

  return <HostSmartleadView currentItem={host} />;
}
