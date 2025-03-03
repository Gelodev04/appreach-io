import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { HubspotHeader } from './_components/hubspot-header';
import { HubspotTable } from './_components/hubspot-table';

export const metadata = {
  title: 'Hubspot | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const testRows = [
  {
    id: 0,
    name: 'Test Name',
    profile: 'Test Profile',
    contacts: 0,
    campaignId: 0,
    created: new Date(),
    updated: new Date(),
    revenue: 0,
    description: 'Test Description',
  },
];

export default async function Page() {
  const { allHosts: senderProfiles } = await getSenderProfiles();

  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <HubspotHeader allHosts={senderProfiles} />

      <ItemUsageDisplay itemName="Campaigns" used={0} limit={5000} />

      <HubspotTable rows={testRows} />
    </Container>
  );
}
