import { HostEditView } from 'src/sections/host/view';
import { getHostById } from 'src/services/db/hosts';
import { getVerifiedSenderAddressByHostId } from 'src/services/db/sender-addresses';
import { getUserSettings } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Edit sender profile | Outreach Magic',
};

export default async function HostsEditPage({ params }: { params: { hostId: string } }) {
  const { hostId } = params;
  const host = await getHostById(hostId);
  const emails = await getVerifiedSenderAddressByHostId(hostId);
  const planPermissions = await getUserSettings({
    planPermissionsAssigned: true,
    planPermissionFeatures: true,
  });

  return (
    <HostEditView
      currentItem={host}
      planPermissions={{
        seeds: planPermissions.planPermissionsAssigned.seeds,
        engagementMax: planPermissions.planPermissionFeatures.engagementMax,
        planPermissionFeatures: planPermissions.planPermissionFeatures,
      }}
      emails={emails}
    />
  );
}
