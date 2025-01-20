import { Container } from '@mui/material';
import { NewEmailForm } from './_components/new-email-form';
import { NewEmailValidatorHeader } from './_components/new-email-validator-header';

export default function Page() {
  return (
    <Container maxWidth="lg">
      <NewEmailValidatorHeader />

      <NewEmailForm />
    </Container>
  );
}
