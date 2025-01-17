import { Container, Typography } from '@mui/material';
import { HostCreateView } from 'src/sections/host/view';
import { getProfilePlanPermissions, getUserSettings } from 'src/services/db/user-settings';
import Header from '../../senders/email/_components/header';

export const metadata = {
  title: 'Register a new sender profile | Inbox Daddy',
};

export default async function HostsCreatePage() {
  const planPermissions = await getUserSettings({
    planPermissionsAssigned: true,
    planPermissionFeatures: true,
  });

  const { isAllProfileUsed } = await getProfilePlanPermissions();

  if (isAllProfileUsed) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Header />
        <Typography variant="h4">
          You have already used all available sender address. Please upgrade your subscription to
          continue.
        </Typography>
      </Container>
    );
  }

  return (
    <HostCreateView
      planPermissions={{
        seeds: planPermissions.planPermissionsAssigned.seeds,
        planPermissionFeatures: planPermissions.planPermissionFeatures,
        engagementMax: planPermissions.planPermissionFeatures.engagementMax,
      }}
    />
  );
}
