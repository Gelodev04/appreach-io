import { Typography } from '@mui/material';

import React from 'react';

export default function VerificationEmailMessage({ message }: { message: string }) {
  return (
    <Typography variant="body2" sx={{ fontWeight: 600, width: '100%' }}>
      {message}
    </Typography>
  );
}
