import { Link, Typography } from '@mui/material';

import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

const PopupWarningForAllUsedSeeds = () => {
  const { prefillMessage } = useSalesmateChat();
  const handleSalesmateOpen = () => {
    prefillMessage('I am interested in more seeds.');
  };

  return (
    <Typography variant="body2">
      You have used all your seeds,{' '}
      <Link component={RouterLink} href={paths.checkout.root} variant="subtitle2">
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

export default PopupWarningForAllUsedSeeds;
