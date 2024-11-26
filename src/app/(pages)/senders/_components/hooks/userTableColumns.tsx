import { GridColDef } from '@mui/x-data-grid';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';
import EditDeleteAction from '../tables/edit-delete';
import { CopyTextRecord } from '../tables/copy-text-record';

type TableColumnsType = {
  type: 'unverified' | 'verified';
  options: {
    profile: string;
    id: string;
  }[];
  action: 'delete' | 'edit' | 'both';
};

export const useTableColumns = ({ action, options, type }: TableColumnsType) => {
  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'hostId',
      headerName: 'Assigned Profile',
      flex: 1,
      sortable: false,
      renderCell: (params) => <AssignedProfileDropdown params={params} options={options} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ id }) => <EditDeleteAction action={action} id={id as string} />,
    },
  ];

  if (type === 'unverified') {
    columns.splice(2, 0, {
      field: 'textRecord',
      headerName: 'TXT Record',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (value ? <CopyTextRecord textRecord={value} /> : ''),
    });
  }

  return { columns };
};
