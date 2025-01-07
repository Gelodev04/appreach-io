import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import AddDomainNameButton from './add-domain-name-btn';
import AddEmailAddressBtn from './add-email-address-btn';

const AddressesHeader = ({ isAllAddressedUsed }: { isAllAddressedUsed: boolean }) => {
  return (
    <Grid
      container
      spacing={2}
      gridColumn={{ sm: 1 }}
      justifyContent={{ xs: 'center', sm: 'center', md: 'space-between' }}
      alignItems="center"
    >
      <Grid item>
        <Box>
          <Typography variant="h4" gutterBottom>
            Senders Addresses
          </Typography>
          <Typography
            sx={{
              typography: 'body2',
              alignItems: 'center',
              color: 'text.disabled',
              display: 'inline-flex',
            }}
          >
            Sender Addresses
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
          <AddEmailAddressBtn isAllAddressedUsed={isAllAddressedUsed} />
          <AddDomainNameButton isAllAddressedUsed={isAllAddressedUsed} />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AddressesHeader;
