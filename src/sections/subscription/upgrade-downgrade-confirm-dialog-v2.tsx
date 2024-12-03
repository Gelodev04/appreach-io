import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { useMemo, useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { SubscriptionData } from 'src/types/stripe';
import { getSubscriptionData } from 'src/utils/stripe';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm?: VoidFunction;
  type: 'upgrade' | 'downgrade';
  nextPlan?: SubscriptionData;
};

export function UpgradeDowngradeConfirmDialogV2({
  open,
  onClose,
  onConfirm,
  type,
  nextPlan,
}: Props) {
  const { subscription } = useCurrentSubscription();
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(() => {
      if (onConfirm) onConfirm();
    });
  };

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return getSubscriptionData(subscription.price_id);
  }, [subscription]);

  const renderContent = (
    <Typography sx={{ textAlign: 'left' }}>
      {type === 'upgrade'
        ? `You are  upgrading from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'.`
        : `You are downgrading from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan.`}
    </Typography>
  );

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={`Confirm plan ${type}`}
      hideCancelButton
      content={renderContent}
      action={
        <>
          <Button variant="outlined" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            loadingIndicator={<Typography>Updating...</Typography>}
            sx={{ paddingX: 3 }}
            loading={isPending}
          >
            Confirm
          </LoadingButton>
        </>
      }
    />
  );
}
