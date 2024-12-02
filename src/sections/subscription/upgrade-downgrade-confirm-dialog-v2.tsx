import { Button } from '@mui/material';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { SubscriptionData } from 'src/types/stripe';
import { fCurrency } from 'src/utils/format-number';
import { createCheckoutSession, getSubscriptionData, redirectToCheckout } from 'src/utils/stripe';
import { calcProrationAmount } from './utils/calc-proration-amount';

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
  const { enqueueSnackbar } = useSnackbar();
  const { subscription } = useCurrentSubscription();
  const { data: session } = useSession();
  const [prorationValue, setProrationValue] = useState<number>(0);

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return getSubscriptionData(subscription.price_id);
  }, [subscription]);

  const endSubscriptionDate = useMemo(() => {
    if (!subscription?.current_period_end) return '';
    return format(new Date(subscription.current_period_end), 'MMMMMM do yyyy');
  }, [subscription]);

  const renderContent = (
    <p>
      {type === 'upgrade'
        ? `You are  upgrading from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'.`
        : `You are downgrading from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan.`}
    </p>
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
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={type === 'upgrade' && !prorationValue}
            color="primary"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </>
      }
    />
  );
}
