'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import HostsNewEditForm from '../host-new-edit-form';

// ----------------------------------------------------------------------

export default function HostCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add a new host"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Hosts',
            href: paths.dashboard.host.root,
          },
          { name: 'New host' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostsNewEditForm />
    </Container>
  );
}
