import { Button } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { SubscriptionData } from 'src/types/stripe';
import { getSubscriptionDataByPriceId } from 'src/utils/stripe';
import { calcProrationAmount } from './utils/calc-proration-amount';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
  type: 'upgrade' | 'downgrade';
  nextPlan?: SubscriptionData;
};

export function UpgradeDowngradeConfirmDialog({ open, onClose, onConfirm, type, nextPlan }: Props) {
  const { subscription } = useCurrentSubscription();
  const [prorationValue, setProrationValue] = useState<number>(0);

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return getSubscriptionDataByPriceId(subscription.price_id);
  }, [subscription]);

  const endSubscriptionDate = useMemo(() => {
    if (!subscription?.current_period_end) return '';
    return format(new Date(subscription.current_period_end), 'MMMMMM do yyyy');
  }, [subscription]);

  // Calculate the proration amount
  useEffect(() => {
    if (type !== 'upgrade') return;
    const getProrationAmount = async () => {
      if (!subscription || !nextPlan?.priceId) return;
      const amount = await calcProrationAmount(subscription?.subscription_id, nextPlan.priceId);
      setProrationValue(amount);
    };

    getProrationAmount();
  }, [subscription, nextPlan, type]);

  const renderContent = (
    <p>
      {type === 'upgrade'
        ? `You are changing from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'. You will be charged $${prorationValue} now and then ${nextPlan?.price} starting on ${endSubscriptionDate}. You can cancel at anytime.`
        : `You are changing from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'. Downgrade will take place at the end of the current billing cycle starting on ${endSubscriptionDate}. You can cancel at anytime.`}
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
            No
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes
          </Button>
        </>
      }
    />
  );
}
