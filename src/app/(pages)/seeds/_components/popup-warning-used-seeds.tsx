import { Link, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

const PopupWarningForAllUsedSeeds = () => {
  return (
    <Typography variant="body2">
      You have used all your seeds,{' '}
      <Link component={RouterLink} href={paths.checkout.root} variant="subtitle2">
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

export default PopupWarningForAllUsedSeeds;
