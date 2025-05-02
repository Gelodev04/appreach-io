import { Container } from '@mui/material';
import { getLeadStatusByHostIds } from 'src/services/db/lead-status';
import { LeadStatusHeader } from './_components/lead-status-header';
import { LeadStatusTable } from './_components/lead-status-table';

export const metadata = {
  title: 'Set Lead Status | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getLeadStatusByHostIds();

  const transformedRows = rows.map((row) => ({
    ...row,
    sentiment: row.lead_status?.sentiment,
  }));
  console.log({ transformedRows });
  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <LeadStatusHeader />

      <LeadStatusTable rows={transformedRows} />
    </Container>
  );
}
