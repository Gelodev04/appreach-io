import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/swr';

import { ICsvUpload } from 'src/types/csv-upload';

// ----------------------------------------------------------------------

export function useGetCsvUploads() {
  const URL = endpoints.csvUpload.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      csvUpload: (data?.csvUpload as ICsvUpload[]) || [],
      csvUploadLoading: isLoading,
      csvUploadError: error,
      csvUploadValidating: isValidating,
      csvUploadEmpty: !isLoading && !data?.csvUpload.length,
    }),
    [data?.csvUpload, error, isLoading, isValidating]
  );

  return memoizedValue;
}
