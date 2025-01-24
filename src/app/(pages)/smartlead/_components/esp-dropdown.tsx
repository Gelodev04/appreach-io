import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { useTransition } from 'react';

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

export const EspDropdown = ({ params }: { params: GridCellParams }) => {
  const [isPending, startTransition] = useTransition();

  const options = [
    'google business',
    'microsoft business',
    'google personal',
    'microsoft personal',
  ];

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
      {options.map((esp) => (
        <MenuItem value={esp} key={esp}>
          {esp}
        </MenuItem>
      ))}
    </Select>
  );
};
