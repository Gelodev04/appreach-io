import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/swr';

import { IHost } from 'src/types/host';

// ----------------------------------------------------------------------

export function useGetHosts() {
  const URL = endpoints.host.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const revalidateHosts = async () => {
    await mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      hosts: (data?.hosts as IHost[]) || [],
      hostsLoading: isLoading,
      hostsError: error,
      hostsValidating: isValidating,
      hostsEmpty: !isLoading && !data?.hosts.length,
      revalidateHosts,
    }),
    [data?.hosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetHost(hostId: string) {
  const URL = endpoints.host.details(hostId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      host: data?.host as IHost,
      hostLoading: isLoading,
      hostError: error,
      hostValidating: isValidating,
    }),
    [data?.host, error, isLoading, isValidating]
  );

  return memoizedValue;
}
