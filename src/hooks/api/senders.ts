import { useMemo } from 'react';
import { ISenders } from 'src/types/senders';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useGetSenders() {
  const URL = endpoints.senders.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      senders: (data?.senders as ISenders) || { usedCount: 0, assignedCount: 0 },
      sendersLoading: isLoading,
      sendersError: error,
      sendersValidating: isValidating,
    }),
    [data?.senders, error, isLoading, isValidating]
  );

  return memoizedValue;
}
