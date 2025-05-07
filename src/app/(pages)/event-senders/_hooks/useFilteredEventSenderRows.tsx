import { GridRowsProp } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useEventSendersStore } from 'src/store/event-senders';

export const useFilteredEventSenderRows = (rows: GridRowsProp) => {
  const filters = useEventSendersStore((state) => state.filters);

  return useMemo(() => {
    return rows.filter((row) => {
      const matchesSender =
        !filters.sender ||
        (row.sender ?? '').toLowerCase().includes(filters.sender.toLowerCase().trim());

      const matchesSenderLabel =
        !filters.sender_name ||
        (row.sender_name ?? '').toLowerCase().includes(filters.sender_name.toLowerCase().trim());

      return (
        matchesSender &&
        matchesSenderLabel &&
        (!filters.email_server || row.email_server === filters.email_server) &&
        (!filters.email_reseller || row.email_reseller === filters.email_reseller) &&
        (!filters.platform || row.platform === filters.platform) &&
        (!filters.type || row.type === filters.type) &&
        (!filters.host_id || row.host_id === filters.host_id)
      );
    });
  }, [rows, filters]);
};
