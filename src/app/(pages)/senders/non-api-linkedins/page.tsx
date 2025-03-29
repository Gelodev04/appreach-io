import { Container } from '@mui/material';
import { getSenderAccountByHostIds } from 'src/services/db/sender-accounts';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { NonApiLinkedinsHeader } from './_components/non-api-linkedins-header';
import { NonApiLinkedinsTable } from './_components/non-api-linkedins-table';

export const metadata = {
  title: 'Non-API Linkedins | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const NonAPILinkedinsPage = async () => {
  const { allHosts: senderProfiles } = await getSenderProfiles();
  const rows = await getSenderAccountByHostIds();
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <NonApiLinkedinsHeader />

      <NonApiLinkedinsTable rows={rows} options={senderProfiles} />
    </Container>
  );
};

export default NonAPILinkedinsPage;
