import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const EditDeleteAction = ({ action = 'both' }: { action?: 'delete' | 'edit' | 'both' }) => {
  return (
    <Stack direction="row">
      {action !== 'delete' && (
        <Tooltip title="Edit" placement="top">
          <Button onClick={() => {}} sx={{ zIndex: 20 }}>
            <Iconify icon="flowbite:edit-outline" />
            <Typography>Edit</Typography>
          </Button>
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
