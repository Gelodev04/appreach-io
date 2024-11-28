import { useMemo } from 'react';
import { IHost } from 'src/types/host';
import { ISeed, ISeedAccount } from 'src/types/seed';
import { endpoints, fetcher } from 'src/utils/swr';
import useSWR from 'swr';

// ----------------------------------------------------------------------

export function useGetSeeds() {
  const URL = endpoints.seed.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      seeds: (data?.seeds as ISeed[]) || [],
      seedsLoading: isLoading,
      seedsError: error,
      seedsValidating: isValidating,
      seedsEmpty: !isLoading && !data?.seeds.length,
    }),
    [data?.seeds, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetSeedSettings() {
  const URL = endpoints.seed.settings;
  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      hosts: (data?.hosts as IHost[]) || [],
      assignedCount: (data?.assignedCount as number) || 0,
      error,
      validating: isValidating,
    }),
    [data?.assignedCount, data?.hosts, error, isValidating]
  );

  return memoizedValue;
}

export function useGetSeedAccounts() {
  const URL = endpoints.seed.counts;
  const { data, error, isValidating } = useSWR(URL, fetcher);
  const removeYahooPersonalSeedAcct = data?.seedAccounts.filter(
    (seedAcct: ISeedAccount) => seedAcct.name !== 'yahooPersonal'
  );
  const totalSeedAccounts = removeYahooPersonalSeedAcct?.length
    ? removeYahooPersonalSeedAcct.reduce(
        (sum: number, account: ISeedAccount) => sum + account.amount,
        0
      )
    : 0;
  return {
    seedAccounts: (removeYahooPersonalSeedAcct as ISeedAccount[]) || [],
    seedAccountsLoading: !error && !data,
    seedAccountsError: error,
    seedAccountsValidating: isValidating,
    totalSeedAccounts,
  };
}
