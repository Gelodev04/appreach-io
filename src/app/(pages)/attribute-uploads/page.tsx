import { Container } from '@mui/material';
import { getAttributesUploadsByHostIds } from 'src/services/db/attributes-uploads';
import { AttributesUploadsHeader } from './_components/attributes-uploads-header';
import { AttributesUploadsTable } from './_components/attributes-uploads-table';

export const metadata = {
  title: 'Attribute Uploads | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getAttributesUploadsByHostIds();

  return (
    <Container
      maxWidth={false}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <AttributesUploadsHeader />

      <AttributesUploadsTable rows={rows} />
    </Container>
  );
}
