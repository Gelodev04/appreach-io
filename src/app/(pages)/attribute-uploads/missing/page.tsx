import { Container } from '@mui/material';
import { getEnrichedPositiveLeads } from 'src/services/db/attributes-uploads';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { MissingAttributesHeader } from './_components/missing-attributes-header';
import { MissingAttributesTable } from './_components/missing-attributes-table';

export const metadata = {
  title: 'Missing Attributes | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rawRows = await getEnrichedPositiveLeads();

  const missingAttributeRows = rawRows.map((row) => ({
    ...row,
    id: row.array_id,
  }));

  const { allHosts: senderProfiles } = await getSenderProfiles();
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <MissingAttributesHeader />

      <MissingAttributesTable rows={missingAttributeRows} hostOptions={senderProfiles} />
    </Container>
  );
}
