import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useEventSendersStore } from 'src/store/event-senders';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';

export const MultipleFilter = ({
  emailServerOptions,
  emailResellerOptions,
  platformOptions,
  typeOptions,
  hostOptions,
  ownerOptions,
}: {
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  platformOptions: PlatformOptionsType;
  typeOptions: PlatformOptionsType;
  hostOptions: HostOptionsType;
  ownerOptions: string[];
}) => {
  const filterPopover = usePopover();
  const { filters, setFilter } = useEventSendersStore();
  const activeFilterCount = Object.values(filters).filter((val) => val?.trim() !== '').length;

  const defaultFilterValues = {
    sender: '',
    sender_name: '',
    email_server: '',
    email_reseller: '',
    platform: '',
    type: '',
    host_id: '',
    owner: '',
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
      setLocalFilters(filters); // pull latest filters when user opens the filter dialog
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
                Sender Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter sender name"
                value={localFilters.sender_name}
                onChange={(e) => handleChange('sender_name', e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Email Server
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.email_server}
                displayEmpty
                onChange={(e) => handleChange('email_server', e.target.value)}
              >
                <MenuItem value="">All Email Server</MenuItem>
                {emailServerOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Email Reseller
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.email_reseller}
                displayEmpty
                onChange={(e) => handleChange('email_reseller', e.target.value)}
              >
                <MenuItem value="">All Email Reseller</MenuItem>
                {emailResellerOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Platform
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.platform}
                displayEmpty
                onChange={(e) => handleChange('platform', e.target.value)}
              >
                <MenuItem value="">All Platforms</MenuItem>
                {platformOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Type
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.type}
                displayEmpty
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Assigned Profile
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.host_id}
                displayEmpty
                onChange={(e) => handleChange('host_id', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {hostOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.profile}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="GrayText">
                Owner
              </Typography>
              <Select
                fullWidth
                size="small"
                value={localFilters.owner}
                displayEmpty
                onChange={(e) => handleChange('owner', e.target.value)}
              >
                <MenuItem value="">All Owner</MenuItem>
                {ownerOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
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
