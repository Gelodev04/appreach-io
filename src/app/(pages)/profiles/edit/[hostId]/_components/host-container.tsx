'use client';

import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import HostNewEditForm from 'src/sections/host/host-new-edit-form';
import { IHost } from 'src/types/host';

export const HostContainer = ({ host }: { host: IHost | undefined }) => {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit sender profile"
        links={[
          {
            name: 'Sender Profiles',
            href: paths.settings.root,
          },
          { name: 'Edit sender profile' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostNewEditForm currentItem={host} />
    </Container>
  );
};
