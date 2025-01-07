import { HostEditView } from 'src/sections/host/view';
import { getHostById } from 'src/services/db/hosts';
import { getUserSettings } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Edit sender profile | Inbox Daddy',
};

export default async function HostsEditPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const host = await getHostById(hostId);
  const planPermissions = await getUserSettings({
    planPermissionsAssigned: true,
    planPermissionFeatures: true,
  });

  return (
    <HostEditView
      currentItem={host}
      planPermissions={{
        seeds: planPermissions.planPermissionsAssigned.seeds,
        planPermissionFeatures: planPermissions.planPermissionFeatures,
      }}
    />
  );
}
