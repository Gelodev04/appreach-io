import { getHostById } from 'src/services/db/hosts';
import { getUserSettings } from 'src/services/db/user-settings';
import { HostContainer } from './_components/host-container';

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
    <HostContainer
      currentItem={host}
      planPermissions={{
        seeds: planPermissions.planPermissionsAssigned.seeds,
        planPermissionFeatures: planPermissions.planPermissionFeatures,
      }}
    />
  );
}
