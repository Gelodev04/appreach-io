import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import VerifyUnverifyIcon from '../verify-unverify-icon';

type AccordHeaderType = {
  domain: string;
  isVerified: boolean;
};

export default function AccordHeader({ domain, isVerified }: AccordHeaderType) {
  return (
    <Box display="flex" alignItems="center" sx={{ width: '100%', paddingRight: 5 }}>
      <Typography sx={{ flex: 1 }} fontSize={16}>
        {domain}
      </Typography>
      <Box paddingRight={2}>
        <VerifyUnverifyIcon isVerified={isVerified} tooltipText="domain" />
      </Box>
      <Button
        variant={isVerified ? 'outlined' : 'contained'}
        color="primary"
        sx={{ minWidth: 120 }}
      >
        <Typography fontSize={14}>{isVerified ? 'Verified' : 'Verify domain'}</Typography>
      </Button>
    </Box>
  );
}
