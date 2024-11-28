import { Typography } from '@mui/material';

import React from 'react';

export default function VerificationEmailMessage() {
  return (
    <Typography variant="body2" sx={{ textWrap: 'balance', fontWeight: 600, padding: 1 }}>
      Add verification txt value to your domain DNS settings to verify.
    </Typography>
  );
}
