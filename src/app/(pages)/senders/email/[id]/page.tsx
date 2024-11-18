import { Container } from '@mui/material';
import Header from '../_components/header';
import EditSendersEmailForm from '../_components/form/edit-email-form';

export default function EditForm({ params }: { params: { id: string } }) {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Header />
      <EditSendersEmailForm />
    </Container>
  );
}
