import { Icon } from '@iconify/react';
import { Box, Popover, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { RHFTextField } from 'src/components/hook-form';

export const FilterIDField = ({ enabled }: { enabled: boolean }) => {
  const popoverAnchor = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  return (
    <Box sx={{ alignSelf: 'center', position: 'relative', minWidth: '300px', padding: 1.5 }}>
      <RHFTextField
        disabled={!enabled}
        name="filter_id_key"
        label="Filter ID Key"
        defaultValue="Kajda3"
      />
      <Box
        ref={popoverAnchor}
        aria-owns={openedPopover ? 'filter-id-popover' : undefined}
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
        id="filter-id-popover"
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
          <Typography variant="body2">
            Assign a unique identifier to filter out AI-generated replies.
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};
