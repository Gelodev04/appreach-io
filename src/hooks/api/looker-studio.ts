import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/swr';

// ----------------------------------------------------------------------

export function useGetLookerStudioUrl() {
  const URL = endpoints.lookerStudio;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      url: data?.embedUrl || '',
      urlLoading: isLoading || isValidating,
      urlError: error,
      warningMessage: data?.warningMessage || '',
    }),
    [data?.embedUrl, data?.warningMessage, error, isLoading, isValidating]
  );

  return memoizedValue;
}
