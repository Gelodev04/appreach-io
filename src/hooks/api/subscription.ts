import { useMemo } from 'react';
import { UserSubscriptionPlan } from 'src/types/stripe';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useCurrentSubscription() {
  const URL = endpoints.stripe.subscriptions;

  const { data, isLoading, error, isValidating } = useSWR<UserSubscriptionPlan>(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      subscription: data,
      subscriptionLoading: isLoading || isValidating,
      subscriptionError: error,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
