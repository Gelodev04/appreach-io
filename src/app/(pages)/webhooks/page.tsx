import { Container } from '@mui/material';
import { getConfigDropdownOptions } from 'src/services/db/config';
import { getUserSettings } from 'src/services/db/user-settings';
import { WebhooksHeader } from './_components/webhooks-header';
import { WebhooksTable } from './_components/webhooks-table';

export const metadata = {
  title: 'Webhooks | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { webhook } = await getUserSettings({ webhook: true });
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });
  const rows = platformOptions.filter((option) => !!option.signup_url);
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <WebhooksHeader />

      <WebhooksTable
        rows={rows}
        token={webhook?.token}
        notifyOnDisconnect={webhook?.notify_on_disconnect}
      />
    </Container>
  );
}
