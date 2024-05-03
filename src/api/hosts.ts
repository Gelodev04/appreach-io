import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IHost } from 'src/types/hosts';

// ----------------------------------------------------------------------

const HOSTS: IHost[] = [
  {
    name: 'outreachmagic',
    id: 'outreachmagic_CLLUz',
    timezone: 'America/New_York',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'outreachmagic_abc123',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22outreachmagic_CLLUz%22%7D',
  },
  {
    name: 'k2renewleads',
    id: 'k2renewleads_1B59E',
    timezone: 'America/Los_Angeles',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'k2renewleads_def456',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
  {
    name: 'host3',
    id: 'host3_id',
    timezone: 'America/Chicago',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'host3_ghi789',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
  {
    name: 'host4',
    id: 'host4_id',
    timezone: 'America/Denver',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'host4_jkl012',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
  {
    name: 'host5',
    id: 'host5_id',
    timezone: 'America/Phoenix',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'host5_mno345',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
  {
    name: 'host6',
    id: 'host6_id',
    timezone: 'America/Anchorage',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'host6_pqr678',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
  {
    name: 'host7',
    id: 'host7_id',
    timezone: 'America/Honolulu',
    notificationAddresses: 'notification@example.com',
    externalSenderAddresses: 'sender@example.com',
    inboxEngagement: ['engagement1', 'engagement2'],
    hostCrypt: 'host7_stu901',
    lookerStudioUrl:
      'https://lookerstudio.google.com/embed/u/0/reporting/ea84ddac-8f8e-454e-bb7c-154e637881b4/page/p_rs5qm3ovcd?params=%7B%22hc%22:%22k2renewleads_1B59E%22%7D',
  },
];

export function useGetHosts() {
  const memoizedValue = useMemo(
    () => ({
      hosts: HOSTS,
      hostsLoading: false,
      hostsError: false,
      hostsValidating: false,
      hostsEmpty: !HOSTS.length,
    }),
    []
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetHost(productId: string) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product as IHost,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchHosts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IHost[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
