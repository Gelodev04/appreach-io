'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useSearchParams } from 'next/navigation';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify/iconify';
import { useGetHost } from 'src/hooks/api/host';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import HostNewEditForm from '../host-new-edit-form';
import { HostSkeleton } from '../host-skeleton';

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
            href={paths.settings.root}
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
        heading="Edit infrastructure"
        links={[
          {
            name: 'Settings',
            href: paths.settings.root,
          },
          { name: 'Edit infrastructure' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <HostNewEditForm currentItem={host} />
    </Container>
  );
}
