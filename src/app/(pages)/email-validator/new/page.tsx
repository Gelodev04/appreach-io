import { Container } from '@mui/material';
import { getEmailValidatorPlanPermissions } from 'src/services/db/user-settings';
import { NewEmailForm, NewEmailValidatorHeader } from './_components';

export default async function Page() {
  const { remainingCredits } = await getEmailValidatorPlanPermissions();
  return (
    <Container maxWidth="lg">
      <NewEmailValidatorHeader />

      <NewEmailForm remainingCredits={remainingCredits} />
    </Container>
  );
}
