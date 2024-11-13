import { ISenders } from 'src/types/senders';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useGetSenders() {
  const URL = endpoints.senders.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log({ data: data?.senders?.usedCount, isLoading, error, isValidating });
  return {
    senders: data?.senders as ISenders,
    sendersLoading: isLoading,
    sendersError: error,
    sendersValidating: isValidating,
    isAllSenderProfilesUsed: data?.senders?.usedCount >= data?.senders?.assignedCount,
  };
}
