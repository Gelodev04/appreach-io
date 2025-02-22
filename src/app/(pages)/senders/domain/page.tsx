import { Container, Typography } from '@mui/material';
import { getAddressesPlanPermissions, getSenderProfiles } from 'src/services/db/user-settings';
import CreateDomainForm from './_components/form/new-domain-form';
import DomainHeader from './_components/header';

export default async function DomainPage() {
  const { allHosts: senderProfiles } = await getSenderProfiles();
  const addressesPlanPermissions = await getAddressesPlanPermissions();

  if (addressesPlanPermissions.isAllAddressesUsed) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DomainHeader />
        <Typography variant="h4">
          You have already used all available sender domains. Please upgrade your subscription to
          continue.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DomainHeader />
      <CreateDomainForm senderProfiles={senderProfiles} />
    </Container>
  );
}
