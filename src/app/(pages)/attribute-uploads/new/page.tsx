import { Container } from '@mui/material';
import { getConfigDropdownOptions, getConfigHeaderMapping } from 'src/services/db/config';
import { mapColumnValidation, mapDisplayValueToLabelValue } from 'src/utils';
import { NewAttributesForm } from './_components/new-attributes-form';
import { NewAttributesUploadsHeader } from './_components/new-attributes-uploads-header';

export const metadata = {
  title: 'Upload a new attribute | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const columnOptions = await getConfigDropdownOptions({ key: 'attribute_uploads_column_options' });
  const columnOptionsMapped = mapDisplayValueToLabelValue(columnOptions);
  const columnValidation = mapColumnValidation(
    columnOptions as { value: string; regex: string; format_description: string }[]
  );
  const headerMapping = await getConfigHeaderMapping({ key: 'attribute_uploads_header_mapping' });

  return (
    <Container maxWidth="lg">
      <NewAttributesUploadsHeader />

      <NewAttributesForm
        columnValidation={columnValidation}
        columnOptions={columnOptionsMapped}
        headerMapping={(headerMapping!.value as Record<string, string>) || {}}
      />
    </Container>
  );
}
