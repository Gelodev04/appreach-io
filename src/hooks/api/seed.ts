import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/swr';

import { IHost } from 'src/types/host';
import { ISeed } from 'src/types/seed';

// ----------------------------------------------------------------------

export function useGetSeeds() {
  const URL = endpoints.seed.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const revalidateData = async () => {
    await mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      seeds: (data?.seeds as ISeed[]) || [],
      seedsLoading: isLoading,
      seedsError: error,
      seedsValidating: isValidating,
      seedsEmpty: !isLoading && !data?.seeds.length,
      revalidateData,
    }),
    [data?.seeds, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetSeedSettings() {
  const URL = endpoints.seed.settings;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const revalidateData = async () => {
    await mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      hosts: (data?.hosts as IHost[]) || [],
      assignedCount: (data?.assignedCount as number) || 0,
      error,
      validating: isValidating,
      revalidateData,
    }),
    [data?.seeds, error, isLoading, isValidating]
  );

  return memoizedValue;
}
