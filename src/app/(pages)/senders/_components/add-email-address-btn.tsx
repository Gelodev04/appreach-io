'use client';

import { Button, Link } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const AddEmailAddressBtn = () => {
  return (
    <Link href={paths.senders.email}>
      <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
        Add Email Address
      </Button>
    </Link>
  );
};

export default AddEmailAddressBtn;
