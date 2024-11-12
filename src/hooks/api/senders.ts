import { useMemo } from 'react';
import { ISenders } from 'src/types/senders';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useGetSenders() {
  const URL = endpoints.senders.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const senders = useMemo(
    () => (data?.senders as ISenders) || { usedCount: 0, assignedCount: 0 },
    [data?.senders]
  );
  const isAllSenderProfilesUsed = senders.usedCount >= senders.assignedCount;
  const memoizedValue = useMemo(
    () => ({
      senders,
      sendersLoading: isLoading,
      sendersError: error,
      sendersValidating: isValidating,
      isAllSenderProfilesUsed,
    }),
    [error, isAllSenderProfilesUsed, isLoading, isValidating, senders]
  );

  return memoizedValue;
}
