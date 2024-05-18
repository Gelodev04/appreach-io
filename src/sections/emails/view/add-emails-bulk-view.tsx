'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AddEmailsBulkForm from '../add-emails-bulk-form';

// ----------------------------------------------------------------------

export default function AddEmailsBulkView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add emails in bulk"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Emails',
            href: paths.dashboard.emails.root,
          },
          { name: 'Add emails in bulk' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AddEmailsBulkForm />
    </Container>
  );
}
