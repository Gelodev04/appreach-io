import Container from '@mui/material/Container';
import { getConfigDropdownOptions, getLeadStatusOptions } from 'src/services/db/config';
import { mapDisplayValueToLabelValue } from 'src/utils';
import { AddEventsForm } from './_components/add-events-form';
import { AddEventsHeader } from './_components/add-events-header';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const leadStatusOptions = await getLeadStatusOptions();
  const platformOptions = await getConfigDropdownOptions({ key: 'platform_options' });
  const eventTypeOptions = await getConfigDropdownOptions({ key: 'event_types' });
  const eventTypeMapped = mapDisplayValueToLabelValue(eventTypeOptions);
  return (
    <Container maxWidth="lg">
      <AddEventsHeader />

      <AddEventsForm
        platformOptions={platformOptions}
        leadStatusOptions={leadStatusOptions}
        eventTypeOptions={eventTypeMapped}
      />
    </Container>
  );
}
