import { Link, Typography } from '@mui/material';

import React from 'react';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { paths } from 'src/routes/paths';

const PopupWarningForAllUsedProfiles = () => {
  const { prefillMessage } = useSalesmateChat();
  const handleSalesmateOpen = () => {
    prefillMessage('I am interested in more seeds account.');
  };

  return (
    <Typography variant="body2">
      You have used all your sender profiles,{' '}
      <Link href={paths.checkout.root} variant="subtitle2">
        Upgrade your subscription{' '}
      </Link>
      or{' '}
      <Link variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={handleSalesmateOpen}>
        contact us
      </Link>{' '}
      if you have questions.
    </Typography>
  );
};

export default PopupWarningForAllUsedProfiles;
