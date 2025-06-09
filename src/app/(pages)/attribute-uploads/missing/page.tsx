import { Container } from '@mui/material';
import {
  getCompanyMissingAttributes,
  getPositiveLeadsWithAttributes,
} from 'src/services/db/attributes-uploads';
import { getSenderProfiles } from 'src/services/db/user-settings';
import { MissingAttributesHeader } from './_components/missing-attributes-header';
import { MissingAttributesTab } from './_components/missing-attributes-tab';

export const metadata = {
  title: 'Missing Attributes | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rawPersonRows = await getPositiveLeadsWithAttributes();

  const personRows = rawPersonRows.map((row) => ({
    ...row,
    id: row.person_attributes_id || row.persons_array_id,
  }));

  const rawCompanyRows = await getCompanyMissingAttributes();

  const companyRows = rawCompanyRows.map((row) => ({
    ...row,
    id: `${row.company_attributes_id || row.companies_array_id}|${row.company_linkedin_url},`,
  }));

  const { allHosts: senderProfiles } = await getSenderProfiles();
  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <MissingAttributesHeader />

      <MissingAttributesTab
        hostOptions={senderProfiles}
        personRows={personRows}
        companyRows={companyRows}
      />
    </Container>
  );
}
