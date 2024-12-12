import { GridColDef } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';

type TableColumnsType = {
  options: {
    profile: string;
    id: string;
  }[];
  isArchived?: boolean;
};

export const useSendersEmailCol = ({ options, isArchived }: TableColumnsType) => {
  const theme = useTheme();

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
      renderCell: ({ value }) => <VerifiedValue isVerified={value} />,
    },
    {
      field: 'archived',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const { verified } = row;

        /* TODO: 
          1. handleArchive
          2. handleUnarchive
          3. handleVerify
          4. handleDelete
        
        */

        if (isArchived) {
          return (
            <Tooltip title="Unarchive this sender email." placement="top-start">
              <IconButton size="medium">
                <Icon icon="material-symbols:unarchive" color={theme.palette.primary.lighter} />
              </IconButton>
            </Tooltip>
          );
        }

        return (
          <Box>
            {verified ? (
              <Tooltip title="Archive this sender email." placement="top-start">
                <IconButton size="medium">
                  <Icon icon="material-symbols:archive" color={theme.palette.primary.lighter} />
                </IconButton>
              </Tooltip>
            ) : (
              <Box>
                <Tooltip title="Resend verification email." placement="top-start">
                  <IconButton size="medium">
                    <Icon icon="material-symbols:refresh" color={theme.palette.primary.lighter} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete sender email." placement="top-start">
                  <IconButton size="medium">
                    <Icon icon="material-symbols:delete" color={theme.palette.error.dark} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        );
      },
    },
  ];

  return { columns };
};

export const VerifiedValue = ({ isVerified }: { isVerified: boolean }) => {
  const theme = useTheme();
  return (
    <Box>
      <Tooltip
        title={isVerified ? 'This sender email is verified.' : 'This sender email is unverified.'}
        placement="top-start"
      >
        <Icon
          icon={isVerified ? 'material-symbols:verified-rounded' : 'material-symbols:error'}
          color={theme.palette.primary.lighter}
          width={24}
        />
      </Tooltip>
    </Box>
  );
};
