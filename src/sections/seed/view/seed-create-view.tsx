'use client';

import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import SeedNewEditForm from '../seed-new-edit-form';

type TSeedsView = {
  numOfSeedsAssigned: number;
  userHosts: { label: string; value: string }[];
};

export default function SeedCreateView({ numOfSeedsAssigned, userHosts }: TSeedsView) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Generate seed list"
        links={[
          {
            name: 'Seeds',
            href: paths.seed.root,
          },
          { name: 'Generate seed list' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SeedNewEditForm numOfSeedsAssigned={numOfSeedsAssigned} userHosts={userHosts} />
    </Container>
  );
}
