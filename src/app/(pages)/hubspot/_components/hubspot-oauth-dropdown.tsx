import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTransition } from 'react';

type HostDropdownType = {
  profile: string;
  id: string;
}[];

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

export const HubspotOAuthDropdown = ({
  options,
  item,
  setItem,
}: {
  options: HostDropdownType;
  item: string;
  setItem: (smartleadSync: string) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: SelectChangeEvent<any>) => {
    const newValue = e.target.value;
    startTransition(() => {
      setItem(newValue);
    });
  };

  return (
    <Select
      value={item}
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
