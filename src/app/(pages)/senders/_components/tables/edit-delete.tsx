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
  const handleVerify = () => {
    // TODO:
    /*
          1. //make status to ready
          2  //
      */
  };

  return (
    <Stack direction="row">
      {action !== 'delete' && (
        <Tooltip title="Edit" placement="top">
          <Button onClick={handleVerify} sx={{ zIndex: 20 }}>
            <Iconify icon="flowbite:edit-outline" />
            <Typography>Verify</Typography>
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
