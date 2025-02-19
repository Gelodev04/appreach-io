import { Container } from '@mui/material';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { getAttributesUploadsByHostIds } from 'src/services/db/attributes-uploads';
import { getAttributesUploadsPlanPermissions } from 'src/services/db/user-settings';
import { AttributesUploadsHeader } from './_components/attributes-uploads-header';
import { AttributesUploadsTable } from './_components/attributes-uploads-table';

export const metadata = {
  title: 'Attributes Uploads | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getAttributesUploadsByHostIds();
  const attributesUploadsPlanPermission = await getAttributesUploadsPlanPermissions();
  return (
    <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <AttributesUploadsHeader />

      <ItemUsageDisplay
        itemName="Credits"
        used={attributesUploadsPlanPermission.numOfAttributesUsed}
        limit={attributesUploadsPlanPermission.numOfAttributesAssigned}
      />
      <AttributesUploadsTable rows={rows} />
    </Container>
  );
}
