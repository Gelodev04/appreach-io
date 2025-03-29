import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';

type OptionType = {
  profile: string;
  id: string;
};

type HostDropdownProps = {
  params: GridCellParams;
  options: OptionType[];
  onUpdate: (
    rowId: string,
    selectedOption: { hostId: string; hostName: string }
  ) => Promise<{ success: boolean; message?: string }>;
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

export const HostDropdown = ({ params, options, onUpdate }: HostDropdownProps) => {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: SelectChangeEvent<any>) => {
    startTransition(async () => {
      const selectedOption = options.find((opt) => opt.id === e.target.value);
      if (!selectedOption) return;

      const response = await onUpdate(params.id as string, {
        hostId: selectedOption.id,
        hostName: selectedOption.profile,
      });

      if (!response.success) {
        enqueueSnackbar(response.message || 'Update failed', { variant: 'error', persist: true });
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
