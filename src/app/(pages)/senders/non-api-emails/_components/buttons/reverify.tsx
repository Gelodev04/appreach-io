import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { updateSenderToReadyStatus } from 'src/services/db/sender-addresses';
import { updateDomainToReadyStatus } from 'src/services/db/sender-domains';
import { sendSenderVerification } from 'src/services/webhook/sender-emails';
import VerificationEmailMessage from '../../../email/_components/verification-email-message';

export default function Reverify({
  tooltipText,
  id,
  type,
}: {
  tooltipText: string;
  id: string;
  type: 'email' | 'domain';
}) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    startTransition(async () => {
      const result = await sendSenderVerification({ type });
      if (type === 'email') {
        const readyStatusSender = await updateSenderToReadyStatus(id);

        if (readyStatusSender && result) {
          const message = `A verification email has been sent to ${readyStatusSender.email}, click the confirmation link to verify it.`;
          enqueueSnackbar({
            message: <VerificationEmailMessage message={message} />,
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Unable to verify sender. Please contact support', {
            variant: 'error',
          });
          return undefined;
        }
      }

      if (type === 'domain') {
        const readyStatusDomain = await updateDomainToReadyStatus(id);
        if (readyStatusDomain && result) {
          const message = `We are checking ${readyStatusDomain.domain} for txt record. Check 'Verified Tab' in the next 2 minutes.`;
          enqueueSnackbar({
            message: <VerificationEmailMessage message={message} />,
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Unable to verify sender. Please contact support', {
            variant: 'error',
          });
          return undefined;
        }
      }
    });
  };

  return (
    <Tooltip title={tooltipText} placement="top-start">
      <Box sx={{ p: 0.5, position: 'relative' }}>
        {isPending && ( // Show progress only when pending
          <CircularProgress
            size={38} // Set size larger than the button
            sx={{
              color: theme.palette.grey[300],
              position: 'absolute',
              zIndex: 1,
            }}
          />
        )}
        <IconButton size="medium" onClick={handleVerify} disabled={isPending}>
          <Icon
            icon="material-symbols:refresh"
            color={isPending ? theme.palette.grey[300] : theme.palette.primary.lighter}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}
