import { GridRowsProp } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useLeadStatusStore } from 'src/store/lead-status-store';

export const useFilteredLeadStatusRows = (rows: GridRowsProp) => {
  const filters = useLeadStatusStore((state) => state.filters);
  return useMemo(() => {
    return rows.filter((row: any) => {
      const matchesProfile =
        !filters.profile ||
        (row.host_name ?? '').toLowerCase().includes(filters.profile.toLowerCase().trim());

      const matchesRecipient =
        !filters.recipient ||
        row.recipient?.email?.toLowerCase().includes(filters.recipient) ||
        row.recipient?.linkedin_url?.toLowerCase().includes(filters.recipient);

      const matchesSender =
        !filters.sender ||
        row.sender?.email?.toLowerCase().includes(filters.sender) ||
        row.sender?.linkedin_url?.toLowerCase().includes(filters.sender);

      const matchesPlatform =
        !filters.platform ||
        (row.platform ?? '').toLowerCase().includes(filters.platform.toLowerCase().trim());

      const matchesStatus =
        !filters.status ||
        (row.lead_status?.name ?? '').toLowerCase().includes(filters.status.toLowerCase().trim());

      const matchesSentiment =
        !filters.sentiment ||
        (row.sentiment ?? '').toLowerCase().includes(filters.sentiment.toLowerCase().trim());

      const matchesMessage =
        !filters.message ||
        (row.content?.body ?? '').toLowerCase().includes(filters.message.toLowerCase().trim());

      return (
        matchesProfile &&
        matchesRecipient &&
        matchesSender &&
        matchesPlatform &&
        matchesStatus &&
        matchesSentiment &&
        matchesMessage
      );
    });
  }, [rows, filters]);
};
