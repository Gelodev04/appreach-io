import { Container } from '@mui/material';
import { NewEmailForm } from './_components/new-email-form';
import { NewEmailValidatorHeader } from './_components/new-email-validator-header';

export const metadata = {
  title: 'Validate a new email | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <Container maxWidth="lg">
      <NewEmailValidatorHeader />

      <NewEmailForm />
    </Container>
  );
}
