import { Link, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

const PopupWarningForAllUsedProfiles = () => {
  return (
    <Typography variant="body2">
      You have used all your sender profiles,{' '}
      <Link href={paths.checkout.root} variant="subtitle2">
        Upgrade your subscription{' '}
      </Link>
      or{' '}
      <Link
        href={paths.support.link}
        target="_blank"
        variant="subtitle2"
        sx={{ cursor: 'pointer' }}
      >
        contact us
      </Link>{' '}
      if you have questions.
    </Typography>
  );
};

export default PopupWarningForAllUsedProfiles;
