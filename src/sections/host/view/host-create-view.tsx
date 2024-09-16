'use client';

import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import HostsNewEditForm from '../host-new-edit-form';

// ----------------------------------------------------------------------

export default function HostCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Register a new infrastructure"
        links={[
          {
            name: 'Settings',
            href: paths.settings.root,
          },
          { name: 'New infrastructure' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostsNewEditForm />
    </Container>
  );
}
