import { Container } from '@mui/material';
import { getEventsByHostIds } from 'src/services/db/manual-events';
import { ManualEventsHeader } from './_components/manual-events-header';
import { ManualEventsTable } from './_components/manual-events-table';

export const metadata = {
  title: 'Manual Events | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getEventsByHostIds();

  const transformedRows = rows.map((row) => ({
    ...row,
    sentiment: row.lead_status?.sentiment,
  }));
  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <ManualEventsHeader />

      <ManualEventsTable rows={transformedRows} />
    </Container>
  );
}
