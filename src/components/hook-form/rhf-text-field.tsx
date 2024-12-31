import { Icon } from '@iconify/react';
import { Box, Popover, Typography } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  tooltipContent?: string;
  tooltipID?: string;
};

export default function RHFTextField({
  name,
  helperText,
  tooltipContent,
  tooltipID,
  type,
  ...other
}: Props) {
  const { control } = useFormContext();
  const popoverAnchor = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  return tooltipContent ? (
    <Box sx={{ position: 'relative', padding: 1.5 }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            type={type}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onChange={(event) => {
              if (type === 'number') {
                field.onChange(Number(event.target.value));
              } else {
                field.onChange(event.target.value);
              }
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
        )}
      />
      <Box
        ref={popoverAnchor}
        aria-owns={openedPopover ? tooltipID : undefined}
        aria-haspopup="true"
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100%',
          position: 'absolute',
          right: -10,
          top: -10,
          padding: '3px',
          color: '#9F9F9F',
        }}
      >
        <Icon width={20} icon="material-symbols:info-outline" />
      </Box>

      <Popover
        id={tooltipID}
        open={openedPopover}
        anchorEl={popoverAnchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
        slotProps={{ paper: { sx: { pointerEvents: 'auto' } } }}
        sx={{ pointerEvents: 'none' }}
      >
        <Box sx={{ maxWidth: '300px', padding: 1 }}>
          <Typography variant="body2">{tooltipContent}</Typography>
        </Box>
      </Popover>
    </Box>
  ) : (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
