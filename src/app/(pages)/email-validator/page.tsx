import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getAllEmailValidator } from 'src/services/db/email-validator';
import { getEmailValidatorPlanPermissions } from 'src/services/db/user-settings';
import { EmailValidatorHeader, EmailValidatorTable } from './_components';

export const metadata = {
  title: 'Email Validator | Inbox Daddy',
};

export default async function Page() {
  const rows = await getAllEmailValidator();
  const emailValidatorPlanPermission = await getEmailValidatorPlanPermissions();
  console.log(emailValidatorPlanPermission);
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <EmailValidatorHeader />

      <ItemUsageDisplay
        itemName="Credits"
        used={emailValidatorPlanPermission.numOfCreditsUsed}
        limit={emailValidatorPlanPermission.numOfCreditsAssigned}
      />
      <EmailValidatorTable
        rows={rows}
        isAllCreditsUsed={emailValidatorPlanPermission.isAllCreditsUsed}
      />
    </Container>
  );
}
