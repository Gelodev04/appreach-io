import { SenderCreateView } from 'src/sections/host/view';
import { getUserSettings } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Register a new sender profile | Inbox Daddy',
};

export default async function HostsCreatePage() {
  const { planPermissions } = await getUserSettings({ planPermissions: true });
  return <SenderCreateView planPermissions={planPermissions} />;
}
