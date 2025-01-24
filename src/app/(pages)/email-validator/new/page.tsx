import { Container } from '@mui/material';
import { getEmailValidatorPlanPermissions } from 'src/services/db/user-settings';
import { NewEmailForm } from './_components/new-email-form';
import { NewEmailValidatorHeader } from './_components/new-email-validator-header';

export const metadata = {
  title: 'Validate a new email | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { remainingCredits } = await getEmailValidatorPlanPermissions();
  return (
    <Container maxWidth="lg">
      <NewEmailValidatorHeader />

      <NewEmailForm remainingCredits={remainingCredits} />
    </Container>
  );
}
