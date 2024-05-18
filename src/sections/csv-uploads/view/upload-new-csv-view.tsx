'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CsvUploadsNewEditForm from '../csv-uploads-new-edit-form';

// ----------------------------------------------------------------------

export default function UploadNewCsvView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Upload CSV file"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Attribute Uploads',
            href: paths.dashboard.csvUploads.root,
          },
          { name: 'Upload CSV' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CsvUploadsNewEditForm />
    </Container>
  );
}
