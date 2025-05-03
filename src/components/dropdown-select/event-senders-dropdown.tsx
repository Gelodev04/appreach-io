import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { PlatformOptionsType } from 'src/types/dropdown-types';

type EventSendersDropdownProps = {
  params: GridCellParams;
  options: PlatformOptionsType;
  onUpdate: (
    rowId: string,
    selectedOption: { label: string; value: string }
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

export const EventSendersDropdown = ({ params, options, onUpdate }: EventSendersDropdownProps) => {
  const [isPending, startTransition] = useTransition();
  const currentValue = params.value ? String(params.value) : '';

  const handleChange = (e: SelectChangeEvent<any>) => {
    startTransition(async () => {
      const selectedOption = options.find((opt) => opt.value === e.target.value);
      if (!selectedOption) return;

      const response = await onUpdate(params.id as string, {
        label: selectedOption.label,
        value: selectedOption.value,
      });

      if (!response.success) {
        enqueueSnackbar(response.message || 'Update failed', { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Update success!');
      }
    });
  };

  // Check if current value exists in the options
  const selectedInOptions = options.some((opt) => opt.value === currentValue);

  return (
    <Select
      value={currentValue}
      disabled={isPending}
      onChange={handleChange}
      style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
      MenuProps={MenuProps}
    >
      {!selectedInOptions && currentValue && (
        <MenuItem value={currentValue} disabled>
          {currentValue}
        </MenuItem>
      )}
      {options.map((opt) => (
        <MenuItem value={opt.value} key={`${opt.value}-${params.id}`}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};
