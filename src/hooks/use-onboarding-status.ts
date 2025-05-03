import { useEffect } from 'react';
import { useUserOnboardingStore } from 'src/store/user-onboarding';
import { fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function useOnboardingStatus() {
  const { completedOn, setCompletedOn, hydrated } = useUserOnboardingStore();

  const { data, isLoading, error, mutate } = useSWR(
    hydrated ? '/api/user-onboarding-settings' : null,
    fetcher
  );

  const rawCompletedOn = data?.onboarding?.completedOn ?? null;

  // Sync to Zustand after SWR fetch
  useEffect(() => {
    if (data?.onboarding) {
      setCompletedOn(data.onboarding.completedOn ?? null);
    }
  }, [data, setCompletedOn]);

  return {
    completedOn, // Zustand value
    rawCompletedOn, // SWR value — immediate
    isLoading,
    error,
    hydrated,
    refreshOnboardingStatus: mutate,
  };
}
