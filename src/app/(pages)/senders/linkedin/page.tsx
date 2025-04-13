import { Container } from '@mui/material';
import { getConfigDropdownOptions } from 'src/services/db/config';
import { getSenderAccountByHostIdsAndType } from 'src/services/db/sender-accounts';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { mapDisplayValueToLabelValue } from 'src/utils';
import { LinkedinHeader } from './_components/linkedin-header';
import { LinkedinTable } from './_components/linkedin-table';

export const metadata = {
  title: 'Linkedins | Outreach Magic',
};

export const dynamic = 'force-dynamic';

const NonAPILinkedinsPage = async () => {
  const { allHosts: senderProfiles } = await getSenderProfiles();
  const options = await getConfigDropdownOptions({ key: 'platform_options' });
  const platFormOptions = mapDisplayValueToLabelValue(options);
  const rows = await getSenderAccountByHostIdsAndType({ type: 'linkedin' });
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <LinkedinHeader />

      <LinkedinTable rows={rows} hostOptions={senderProfiles} platFormOptions={platFormOptions} />
    </Container>
  );
};

export default NonAPILinkedinsPage;
