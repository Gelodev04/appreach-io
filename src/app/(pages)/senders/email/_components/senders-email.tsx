import { Container } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import CreateSendersEmailForm from './form/new-email-form';
import Header from './header';

export default async function AddSenderEmailPage() {
  const { allHosts: senderProfiles } = await getSenderProfiles();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Header />
      <CreateSendersEmailForm senderProfiles={senderProfiles} />
    </Container>
  );
}
