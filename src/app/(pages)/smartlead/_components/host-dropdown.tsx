import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { updateSmartleadHost } from 'src/services/db/smartlead';

type HostDropdownType = {
  params: GridCellParams;
  options: {
    profile: string;
    id: string;
  }[];
};

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

export const HostDropdown = ({ params, options }: HostDropdownType) => {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: SelectChangeEvent<any>) => {
    startTransition(async () => {
      const selectedHost = options.find((host) => host.id === e.target.value);

      const response = await updateSmartleadHost(params.id as string, {
        hostId: e.target.value,
        hostName: selectedHost!.profile,
      });

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Update success!');
      }
    });
  };

  return (
    <Select
      value={params.value}
      disabled={isPending}
      onChange={handleChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
      MenuProps={MenuProps}
    >
      {options.map((profile) => (
        <MenuItem value={profile.id} key={`${profile.id}-${params.id}`}>
          {profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
};
