import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/swr';

import { IHost } from 'src/types/host';

// ----------------------------------------------------------------------

export function useGetHosts() {
  const URL = endpoints.host.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      hosts: (data?.hosts as IHost[]) || [],
      hostsLoading: isLoading,
      hostsError: error,
      hostsValidating: isValidating,
      hostsEmpty: !isLoading && !data?.hosts.length,
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
