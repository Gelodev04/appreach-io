import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { useTransition } from 'react';

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
      // try {
      //   if (!tableIndex) return undefined;

      //   await updateSenderProfiles(params.id as string, e.target.value, tableIndex);
      // } catch (error) {
      //   throw new Error('Unable to update the assigned profile. Please contact support.');
      // }

      console.log('Submitting...');
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
