import { useMemo } from 'react';
import { STRIPE } from 'src/config-global';
import { useUsersPlanStore } from 'src/store/user-setting';

export function useIsTrialExpired(): boolean {
  const { plan } = useUsersPlanStore();

  const isExpired = useMemo(() => {
    if (plan?.lookup_key !== STRIPE.subscriptions.trial.key || !plan?.current_period_end)
      return false;

    return plan?.current_period_end < new Date();
  }, [plan?.current_period_end, plan?.lookup_key]);

  return isExpired;
}
