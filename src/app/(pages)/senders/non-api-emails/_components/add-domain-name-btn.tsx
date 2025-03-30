'use client';

import { Button } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import WarningAllAddressesUsed from './warning-all-addresses-used';

const AddDomainNameButton = ({ isAllAddressedUsed }: { isAllAddressedUsed: boolean }) => {
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

    router.push(paths.senders.domain);
  };
  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color="primary"
      startIcon={<Iconify icon="mingcute:add-line" />}
    >
      Add Domain Name
    </Button>
  );
};

export default AddDomainNameButton;
