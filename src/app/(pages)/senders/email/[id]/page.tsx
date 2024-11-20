import { Container } from '@mui/material';
import { getUnverifiedSenderById } from 'src/services/db/verified-domains';
import { getSenderProfiles } from 'src/services/db/user-settings';
import Header from '../_components/header';
import EditSendersEmailForm from '../_components/form/edit-email-form';

export default async function EditForm({ params }: { params: { id: string } }) {
  const senderProfiles = await getSenderProfiles();
  const unverifiedSender = await getUnverifiedSenderById(params.id);

  if (!unverifiedSender) throw new Error('Email not found in unverified sender collection');

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Header />
      <EditSendersEmailForm senderProfiles={senderProfiles} unverifiedSender={unverifiedSender} />
    </Container>
  );
}
