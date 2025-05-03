import { Container } from '@mui/material';
import { getEmailValidatorByHostIds } from 'src/services/db/email-validator';
import { EmailValidatorHeader } from './_components/email-validator-header';
import { EmailValidatorTable } from './_components/email-validator-table';

export const metadata = {
  title: 'Email Validator | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getEmailValidatorByHostIds();
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <EmailValidatorHeader />

      <EmailValidatorTable rows={rows} />
    </Container>
  );
}
