'use client';

import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import HostNewEditForm from 'src/sections/host/host-new-edit-form';
import { HostProps } from 'src/types/host';

export const HostEditView = ({ currentItem, planPermissions, emails }: HostProps) => {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit seed settings"
        links={[
          {
            name: 'Sender Profiles',
            href: paths.settings.root,
          },
          { name: 'Edit seed settings' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostNewEditForm
        currentItem={currentItem}
        planPermissions={planPermissions}
        emails={emails}
      />
    </Container>
  );
};
