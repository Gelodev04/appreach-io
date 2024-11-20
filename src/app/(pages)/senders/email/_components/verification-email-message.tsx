import { Link, Typography } from '@mui/material';

import React from 'react';

export default function VerificationEmailMessage({
  name,
  confirmationLink,
}: {
  name: string;
  confirmationLink: string;
}) {
  return (
    <Typography
      variant="body2"
      maxWidth={500}
      sx={{ textWrap: 'balance', fontWeight: 600, padding: 2 }}
    >
      A verification email has been sent to {name}, click the confirmation link to verify it.{' '}
      <Link href={confirmationLink} sx={{ cursor: 'pointer' }}>
        Verify your email.
      </Link>
    </Typography>
  );
}
