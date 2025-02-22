import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { espData } from 'src/constants';
import { updateSmartleadEsp } from 'src/services/db/smartlead';

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
      const selectedEsp = espData[e.target.value as keyof typeof espData];

      const response = await updateSmartleadEsp(params.id as string, selectedEsp);

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
      {options.map((esp) => (
        <MenuItem value={esp} key={esp}>
          {esp}
        </MenuItem>
      ))}
    </Select>
  );
};
