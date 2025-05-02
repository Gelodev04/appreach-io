import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack'; // 🧠 import this
import Iconify from '../iconify';
import CustomPopover from './custom-popover';

interface EditPopoverProps {
  open: HTMLElement | null;
  onClose: () => void;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  loading: boolean;
  onChange: (e: SelectChangeEvent) => void;
  onSave: () => void;
  name: string;
}

export const EditPopover = ({
  open,
  onClose,
  label,
  value,
  options,
  loading,
  onChange,
  onSave,
  name,
}: EditPopoverProps) => {
  const handleSaveClick = () => {
    if (!value) {
      enqueueSnackbar(`Please select a value for ${label} before saving.`, {
        variant: 'error',
        persist: true,
      });
      return;
    }

    onSave();
  };

  return (
    <CustomPopover arrow="top-center" open={open} sx={{ width: 500, p: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            Edit {label}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <Iconify icon="material-symbols:close" />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2" color="GrayText">
            {label}
          </Typography>
          <Select name={name} value={value} disabled={loading} onChange={onChange}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Button
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={handleSaveClick} // ✅ now using validated handler
        >
          Save changes
        </Button>
      </Box>
    </CustomPopover>
  );
};
