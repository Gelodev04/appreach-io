import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTransition } from 'react';
import { useSmartleadSyncStore } from 'src/store/smartlead';

type HostDropdownType = {
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

export const SmartleadSyncDropdown = ({ options }: HostDropdownType) => {
  const [isPending, startTransition] = useTransition();
  const { smartlead, setSmartlead } = useSmartleadSyncStore(); // Access Zustand store

  const handleChange = (e: SelectChangeEvent<any>) => {
    const newValue = e.target.value;
    startTransition(() => {
      setSmartlead(newValue);
    });
  };

  return (
    <Select
      value={smartlead}
      disabled={isPending}
      onChange={handleChange}
      style={{ width: '100%' }}
      MenuProps={MenuProps}
    >
      {options.map((profile) => (
        <MenuItem value={profile.id} key={profile.id}>
          {profile.profile}
        </MenuItem>
      ))}
    </Select>
  );
};
