'use client';

import { Container } from '@mui/material';
import { hosts } from '@prisma/client';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import HostSmartleadForm from '../host-smartlead-form';

export const HostSmartleadView = ({ currentItem }: { currentItem: hosts }) => {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit smartlead settings"
        links={[
          {
            name: 'Sender Profiles',
            href: paths.settings.root,
          },
          { name: 'Edit smartlead settings' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostSmartleadForm currentItem={currentItem} />
    </Container>
  );
};
