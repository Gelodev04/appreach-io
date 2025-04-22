import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { updateDomainToReadyStatus } from 'src/services/db/sender-domains';
import { sendSenderVerification } from 'src/services/webhook/sender-emails';
import VerificationEmailMessage from '../../../email/_components/verification-email-message';
import VerifyUnverifyIcon from '../verify-unverify-icon';

type AccordHeaderType = {
  domain: string;
  isVerified: boolean;
  id: string;
};

export default function AccordHeader({ domain, isVerified, id }: AccordHeaderType) {
  const [isPending, startTransition] = useTransition();

  const handleDomainVerification = () => {
    if (isVerified) return undefined;
    startTransition(async () => {
      const readyStatusDomain = await updateDomainToReadyStatus(id);
      const result = await sendSenderVerification({ type: 'domain' });
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
    });
  };
  return (
    <Box display="flex" alignItems="center" sx={{ width: '100%', paddingRight: 5 }}>
      <Typography sx={{ flex: 1 }} fontSize={16}>
        {domain}
      </Typography>
      <Box paddingRight={2}>
        <VerifyUnverifyIcon isVerified={isVerified} tooltipText="domain" />
      </Box>
      <LoadingButton
        variant={isVerified ? 'outlined' : 'contained'}
        color="primary"
        sx={{ minWidth: 160 }}
        onClick={handleDomainVerification}
        disabled={isPending}
        loading={isPending}
        loadingPosition="start"
      >
        <Typography fontSize={14}>{isVerified ? 'Verified' : 'Verify domain'}</Typography>
      </LoadingButton>
    </Box>
  );
}
