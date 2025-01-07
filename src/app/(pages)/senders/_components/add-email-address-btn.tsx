'use client';

import { Button, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { use } from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { enqueueSnackbar } from 'notistack';
import WarningAllAddressesUsed from './warning-all-addresses-used';

const AddEmailAddressBtn = ({ isAllAddressedUsed }: { isAllAddressedUsed: boolean }) => {
  const router = useRouter();
  const handleClick = () => {
    if (isAllAddressedUsed) {
      enqueueSnackbar({
        message: <WarningAllAddressesUsed />,
        variant: 'warning',
        persist: true,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
      });

      return null;
    }

    router.push(paths.senders.email);
  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      startIcon={<Iconify icon="mingcute:add-line" />}
    >
      Add Email Address
    </Button>
  );
};

export default AddEmailAddressBtn;
