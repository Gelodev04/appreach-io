import Container from '@mui/material/Container';
import { getLeadStatusOptions, getPlatformOptions } from 'src/services/db/config';
import { UpdateLeadStatusForm } from './_components/update-lead-status-form';
import { UpdateLeadStatusHeader } from './_components/update-lead-status-header';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const platformOptions = await getPlatformOptions();
  const leadStatusOptions = await getLeadStatusOptions();

  return (
    <Container maxWidth="lg">
      <UpdateLeadStatusHeader />

      <UpdateLeadStatusForm
        platformOptions={platformOptions}
        leadStatusOptions={leadStatusOptions}
      />
    </Container>
  );
}
