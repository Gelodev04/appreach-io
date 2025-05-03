import { useEffect } from 'react';
import { useUserPlanPermissionsStore } from 'src/store/user-plan-permissions';
import { fetcher } from 'src/utils/swr';
import useSWR from 'swr';

export function usePlanPermissions() {
  const { otherTools, setOtherTools, hydrated } = useUserPlanPermissionsStore();

  const { data, isLoading, error, mutate } = useSWR(
    hydrated ? '/api/user-plan-permissions' : null, // fetch AFTER hydration
    fetcher
  );

  useEffect(() => {
    if (data?.planPermissionFeatures?.otherTools !== undefined) {
      setOtherTools(data.planPermissionFeatures.otherTools);
    }
  }, [data, setOtherTools]);

  return {
    otherTools,
    isLoading: !hydrated && isLoading,
    error,
    hydrated,
    refreshPlanPermissions: mutate, // expose for manual use
  };
}
