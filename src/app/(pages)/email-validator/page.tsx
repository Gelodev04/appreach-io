import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getEmailValidatorByHostIds } from 'src/services/db/email-validator';
import { getEmailValidatorPlanPermissions } from 'src/services/db/user-settings';
import { EmailValidatorHeader } from './_components/email-validator-header';
import { EmailValidatorTable } from './_components/email-validator-table';

export const metadata = {
  title: 'Email Validator | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getEmailValidatorByHostIds();
  const emailValidatorPlanPermission = await getEmailValidatorPlanPermissions();
  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <EmailValidatorHeader />

      <ItemUsageDisplay
        itemName="Credits"
        used={emailValidatorPlanPermission.numOfCreditsUsed}
        limit={emailValidatorPlanPermission.numOfCreditsAssigned}
      />
      <EmailValidatorTable rows={rows} />
    </Container>
  );
}
