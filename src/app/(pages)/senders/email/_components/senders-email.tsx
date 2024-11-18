import { Container } from '@mui/material';
import { getSenderProfiles } from 'src/services/db/user-settings';
import Header from './header';
import CreateSendersEmailForm from './form/new-email-form';

export default async function AddSenderEmailPage() {
  const senderProfiles = await getSenderProfiles();

  if (!senderProfiles) throw new Error('Undefined sender profiles');

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Header />
      <CreateSendersEmailForm senderProfiles={senderProfiles} />
    </Container>
  );
}
