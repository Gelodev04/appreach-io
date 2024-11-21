'use client';

import { Button } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const AddDomainNameButton = () => {
  return (
    <Button
      onClick={() => {}}
      variant="contained"
      color="primary"
      startIcon={<Iconify icon="mingcute:add-line" />}
    >
      Add Domain Name
    </Button>
  );
};

export default AddDomainNameButton;
