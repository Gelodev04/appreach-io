'use client';

import Button from '@mui/material/Button';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <EmptyContent
      title="Oops, unexpected error!"
      description={error.message}
      action={
        <Button
          component={RouterLink}
          href={paths.profiles.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
    />
  );
}
