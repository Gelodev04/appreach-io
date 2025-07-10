import { Container } from '@mui/material';
import { AccountSettingsHeader } from './_components/account-settings-header';
import { AccountSettingsForm } from './_components/account-settings-form';
import { getUserSettings } from 'src/services/db/user-settings';

export const metadata = {
  title: 'Account Settings | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { api } = await getUserSettings({ api: true });

  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <AccountSettingsHeader />
      <AccountSettingsForm userApi={api} />
    </Container>
  );
}
