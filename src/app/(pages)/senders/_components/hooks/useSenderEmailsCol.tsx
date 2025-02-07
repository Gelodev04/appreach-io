import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridColDef, GridFilterInputValueProps, GridFilterOperator } from '@mui/x-data-grid';
import Archive from '../buttons/archived';
import DeleteSender from '../buttons/delete';
import Reverify from '../buttons/reverify';
import Unarchived from '../buttons/unarchived';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';
import VerifyUnverifyIcon from '../verify-unverify-icon';

type TableColumnsType = {
  options: {
    profile: string;
    id: string;
  }[];
  isArchived?: boolean;
  filteredProfile?: string;
};

interface ExtendedGridFilterInputValueProps extends GridFilterInputValueProps {
  options: {
    profile: string;
    id: string;
  }[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AssignedProfileDropdownFilter(props: ExtendedGridFilterInputValueProps) {
  const { item, applyValue, options } = props;

  const handleFilterChange = (e: SelectChangeEvent<any>) => {
    applyValue({ ...item, value: e.target.value });
  };

  return (
    <Select
      value={item?.value ?? ''}
      onChange={handleFilterChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
      MenuProps={MenuProps}
    >
      {options.map((profile) => (
        <MenuItem value={profile.id} key={`${profile.id}`}>
          {profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
}

const assignedProfileDropdownFilter = (options: any) => {
  const assignedProfileOperator: GridFilterOperator<any, number>[] = [
    {
      label: 'Equal',
      value: 'equal',
      getApplyFilterFn: (filterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
        return (params) => {
          return params.value === filterItem.value;
        };
      },
      InputComponent: AssignedProfileDropdownFilter,
      InputComponentProps: { options },
      headerLabel: 'Assigned Profile',
    },
  ];

  return assignedProfileOperator;
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
      filterOperators: assignedProfileDropdownFilter(options),
      renderCell: (params) => (
        <AssignedProfileDropdown params={params} options={options} type="email" />
      ),
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
