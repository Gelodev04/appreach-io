import { Container } from '@mui/material';
import { getAttributesUploadsPlanPermissions } from 'src/services/db/user-settings';
import { NewAttributesForm } from './_components/new-attributes-form';
import { NewAttributesUploadsHeader } from './_components/new-attributes-uploads-header';

export const metadata = {
  title: 'Upload a new attribute | Inbox Daddy',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { remainingAttributes } = await getAttributesUploadsPlanPermissions();
  return (
    <Container maxWidth="lg">
      <NewAttributesUploadsHeader />

      <NewAttributesForm remainingCredits={remainingAttributes} />
    </Container>
  );
}
