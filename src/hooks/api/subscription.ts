import { useMemo } from 'react';
import { StripeSubscription } from 'src/types/stripe';
import { getSubscriptionData } from 'src/utils/stripe';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useCurrentSubscription() {
  const URL = endpoints.stripe.subscriptions;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      subscription: (data as StripeSubscription) || {},
      currentPlan: getSubscriptionData(data?.plan.product),
      isLoading: isLoading || isValidating,
      isError: error,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
