import { Container, Stack } from '@mui/material';
import Header from './header';
import EditSendersEmailForm from './form/edit-email-form';

export default function SendersEmailPage() {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Header />
      <EditSendersEmailForm />
    </Container>
  );
}
