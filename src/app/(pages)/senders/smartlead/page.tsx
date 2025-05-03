import { Container } from '@mui/material';
import { getSmartleadsByHostIds } from 'src/services/db/smartlead';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { SmartleadHeader } from './_components/smartlead-header';
import { SmartleadTable } from './_components/smartlead-table';

export const metadata = {
  title: 'Smartlead | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getSmartleadsByHostIds();

  const { allHosts: senderProfiles, hostsWithApiKey: senderProfilesWithApiKey } =
    await getSenderProfiles();

  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <SmartleadHeader allHosts={senderProfiles} options={senderProfilesWithApiKey} />

      <SmartleadTable rows={rows} options={senderProfiles} />
    </Container>
  );
}
