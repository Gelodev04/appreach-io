import { GridColDef } from '@mui/x-data-grid';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';

type TableColumnsType = {
  options: {
    profile: string;
    id: string;
  }[];
};

export const useSendersEmailCol = ({ options }: TableColumnsType) => {
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
      field: 'verified',
      headerName: 'Verified',
      flex: 1,
    },
    {
      field: 'Action',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  return { columns };
};
