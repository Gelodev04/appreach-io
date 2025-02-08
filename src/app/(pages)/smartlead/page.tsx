import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getSmartleadsByHostIds } from 'src/services/db/smartlead';
import { getSenderProfiles, getSmartleadPlanPermissions } from 'src/services/db/user-settings';
import { SmartleadHeader } from './_components/smartlead-header';
import { SmartleadTable } from './_components/smartlead-table';

export const metadata = {
  title: 'Email Validator | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getSmartleadsByHostIds();
  const smartleadPlanPermission = await getSmartleadPlanPermissions();
  const senderProfiles = await getSenderProfiles();

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <SmartleadHeader />

      <ItemUsageDisplay
        itemName="Accounts"
        used={smartleadPlanPermission.numOfSmartleadUsed}
        limit={smartleadPlanPermission.numOfSmartleadAssigned}
      />

      <SmartleadTable rows={rows} options={senderProfiles} />
    </Container>
  );
}
