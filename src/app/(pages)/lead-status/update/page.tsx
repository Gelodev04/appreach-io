import Container from '@mui/material/Container';
import { getConfigDropdownOptions, getLeadStatusOptions } from 'src/services/db/config';
import { UpdateLeadStatusForm } from './_components/update-lead-status-form';
import { UpdateLeadStatusHeader } from './_components/update-lead-status-header';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });
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
