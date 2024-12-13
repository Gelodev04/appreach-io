import { GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';
import VerifyUnverifyIcon from '../verify-unverify-icon';
import Reverify from '../buttons/reverify';
import DeleteSender from '../buttons/delete';
import Unarchived from '../buttons/unarchived';
import Archive from '../buttons/archived';

type TableColumnsType = {
  options: {
    profile: string;
    id: string;
  }[];
  isArchived?: boolean;
};

export const useSendersEmailCol = ({ options, isArchived }: TableColumnsType) => {
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
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => <VerifyUnverifyIcon isVerified={value} tooltipText="email" />,
    },
    {
      field: 'archived',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { verified, id } = row;
        if (isArchived) {
          return <Unarchived id={id} />;
        }
        return (
          <Box>
            {verified ? (
              <Archive id={id} />
            ) : (
              <Box display="flex">
                <Reverify tooltipText="Resend email verification." id={id} type="email" />
                <DeleteSender tooltipText="Delete email." id={id} type="email" />
              </Box>
            )}
          </Box>
        );
      },
    },
  ];

  return { columns };
};
