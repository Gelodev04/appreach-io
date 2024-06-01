'use client';

import { useSearchParams } from 'next/navigation';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetHost } from 'src/hooks/api/host';

import Iconify from 'src/components/iconify/iconify';
import EmptyContent from 'src/components/empty-content';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { HostSkeleton } from '../host-skeleton';
import HostNewEditForm from '../host-new-edit-form';

// ----------------------------------------------------------------------

export default function HostEditView() {
  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  const { host, hostError, hostLoading } = useGetHost(search as string);

  if (hostError)
    return (
      <EmptyContent
        title={hostError.status}
        description={hostError.message}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.host.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
      />
    );

  if (hostLoading) return <HostSkeleton />;

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit host"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Hosts',
            href: paths.dashboard.host.root,
          },
          { name: 'Edit host' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostNewEditForm currentItem={host} />
    </Container>
  );
}
