import { Typography } from '@mui/material';

import React from 'react';

export default function VerificationEmailMessage({ name }: { name: string }) {
  return (
    <Typography variant="body2" sx={{ textWrap: 'balance', fontWeight: 600, padding: 1 }}>
      Click the confirmation link in the email we sent to {name}.
    </Typography>
  );
}
