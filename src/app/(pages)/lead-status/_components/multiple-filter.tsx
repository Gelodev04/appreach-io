import { Badge, Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useLeadStatusStore } from 'src/store/lead-status-store';

export const MultipleFilter = () => {
  const filterPopover = usePopover();
  const { filters, setFilter } = useLeadStatusStore();
  const activeFilterCount = Object.values(filters).filter((val) => val?.trim() !== '').length;

  const defaultFilterValues = {
    profile: '',
    recipient: '',
    sender: '',
    platform: '',
    status: '',
    sentiment: '',
    message: '',
  };

  const [localFilters, setLocalFilters] = useState(defaultFilterValues);

  const handleChange = (key: keyof typeof localFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) =>
      setFilter(key as keyof typeof localFilters, value)
    );
    filterPopover.onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters(defaultFilterValues);
    Object.entries(defaultFilterValues).forEach(([key, value]) =>
      setFilter(key as keyof typeof defaultFilterValues, value)
    );
  };

  useEffect(() => {
    if (filterPopover.open) {
      setLocalFilters(filters);
    }
  }, [filterPopover.open, filters]);

  return (
    <>
      <Button
        onClick={filterPopover.onOpen}
        size="medium"
        startIcon={
          <Badge badgeContent={activeFilterCount} color="primary">
            <Iconify icon="mdi:filter" />
          </Badge>
        }
      >
        Filters
      </Button>

      <CustomPopover arrow="top-center" open={filterPopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Filter columns
            </Typography>
            <IconButton onClick={filterPopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Profile
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter profile"
                value={localFilters.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Recipient
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter recipient"
                value={localFilters.recipient}
                onChange={(e) => handleChange('recipient', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Sender
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter sender"
                value={localFilters.sender}
                onChange={(e) => handleChange('sender', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Platform
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter platform"
                value={localFilters.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Status
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter status"
                value={localFilters.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Sentiment
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter sentiment"
                value={localFilters.sentiment}
                onChange={(e) => handleChange('sentiment', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Message
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter message"
                value={localFilters.message}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button color="inherit" variant="outlined" onClick={handleClearFilters}>
              Clear all
            </Button>

            <Button color="primary" variant="contained" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </CustomPopover>
    </>
  );
};
