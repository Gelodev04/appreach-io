'use client';

import { Button } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const AddEmailAddressBtn = () => {
  return (
    <Button onClick={() => {}} variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
      Add Email Address
    </Button>
  );
};

export default AddEmailAddressBtn;
