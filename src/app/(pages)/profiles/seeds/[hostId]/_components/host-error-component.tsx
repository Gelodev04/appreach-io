'use client';

import { Button } from '@mui/material';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export const HostErrorComponent = ({ status, message }: { status: string; message: string }) => {
  return (
    <EmptyContent
      title={status}
      description={message}
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
};
