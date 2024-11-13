import { useMemo } from 'react';
import { ISenders } from 'src/types/senders';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useGetSenders() {
  const URL = endpoints.senders.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      senders: data?.senders as ISenders,
      sendersLoading: isLoading,
      sendersError: error,
      sendersValidating: isValidating,
      isAllSenderProfilesUsed: data?.senders?.usedCount >= data?.senders?.assignedCount,
    }),
    [data?.senders, error, isLoading, isValidating]
  );

  return memoizedValue;
}
