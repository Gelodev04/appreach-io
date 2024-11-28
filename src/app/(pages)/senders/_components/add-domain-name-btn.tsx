'use client';

import { Button, Link } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const AddDomainNameButton = () => {
  return (
    <Link href={paths.senders.domain}>
      <Button
        onClick={() => {}}
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        Add Domain Name
      </Button>
    </Link>
  );
};

export default AddDomainNameButton;
