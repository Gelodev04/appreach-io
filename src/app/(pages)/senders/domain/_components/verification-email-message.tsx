import { Typography } from '@mui/material';

import React from 'react';

export default function VerificationEmailMessage() {
  return (
    <Typography variant="body2" sx={{ fontWeight: 600, width: 430, p: 1 }}>
      Add verification txt value to your domain DNS settings to verify.
    </Typography>
  );
}
