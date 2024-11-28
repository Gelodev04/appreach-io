import { Container } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import DomainHeader from './_components/header';
import CreateDomainForm from './_components/form/new-domain-form';

export default async function DomainPage() {
  const senderProfiles = await getSenderProfiles();
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DomainHeader />
      <CreateDomainForm senderProfiles={senderProfiles} />
    </Container>
  );
}
