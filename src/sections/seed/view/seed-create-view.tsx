'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SeedNewEditForm from '../seed-new-edit-form';

// ----------------------------------------------------------------------

export default function SeedCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Add a new seed"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Seeds',
            href: paths.dashboard.seed.root,
          },
          { name: 'New seed' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SeedNewEditForm />
    </Container>
  );
}
