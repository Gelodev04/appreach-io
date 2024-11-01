import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

// ----------------------------------------------------------------------

export function useCheckUserPlan() {
  const URL = endpoints.plan.checkPlan;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plan: data?.plan,
      planLoading: isLoading,
      planError: error,
      planValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
