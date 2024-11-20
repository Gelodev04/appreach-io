import { Button, Link, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const EditDeleteAction = ({
  action = 'both',
  id,
}: {
  action?: 'delete' | 'edit' | 'both';
  id: string;
}) => {
  return (
    <Stack direction="row">
      {action !== 'delete' && (
        <Tooltip title="Edit" placement="top">
          <Link href={`${paths.senders.email}/${id}`} color="GrayText">
            <Button onClick={() => {}} sx={{ zIndex: 20 }}>
              <Iconify icon="flowbite:edit-outline" />
              <Typography>Verify</Typography>
            </Button>
          </Link>
        </Tooltip>
      )}

      <Tooltip title="Delete" placement="top">
        <Button onClick={() => {}} sx={{ zIndex: 20, color: 'error.main' }}>
          <Iconify icon="ph:trash-bold" />
          <Typography>Delete</Typography>
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default EditDeleteAction;
