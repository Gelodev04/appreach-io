import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useMissingAttributesFiltersStore } from 'src/store/attribute-uploads';
import { HostOptionsType } from 'src/types/dropdown-types';

type MissingAttributesFilterType = {
  hostOptions: HostOptionsType;
  hostCounts: Record<string, number>;
};

export const MissingAttributesFilter = ({
  hostOptions,
  hostCounts,
}: MissingAttributesFilterType) => {
  const filterPopover = usePopover();
  const { hostName, setHostName, clearFilters } = useMissingAttributesFiltersStore();

  const handleApplyFilters = () => {
    console.log('Applying filter: host_name =', hostName);
    filterPopover.onClose();
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <>
      <Button
        onClick={filterPopover.onOpen}
        size="medium"
        startIcon={
          <Badge badgeContent={hostName ? 1 : 0} color="primary">
            <Iconify icon="mdi:filter" />
          </Badge>
        }
      >
        Filter by Profile
      </Button>

      <CustomPopover arrow="top-center" open={filterPopover.open} sx={{ width: 400, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Filter by Profile
            </Typography>
            <IconButton onClick={filterPopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box>
            <Typography variant="subtitle2" color="GrayText">
              Profile
            </Typography>
            <Select
              fullWidth
              size="small"
              value={hostName}
              displayEmpty
              onChange={(e) => setHostName(e.target.value)}
            >
              <MenuItem value="">All Profile</MenuItem>
              {hostOptions.map((opt) => {
                const count = hostCounts[opt.profile] || 0;
                return (
                  <MenuItem key={opt.id} value={opt.profile}>
                    {opt.profile}
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '12px',
                        bgcolor: 'grey.200',
                        color: 'black',
                        fontSize: '0.75rem',
                        minWidth: '24px',
                        fontWeight: 500,
                        textAlign: 'center',
                      }}
                    >
                      {count}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button color="inherit" variant="outlined" onClick={handleClearFilters}>
              Clear
            </Button>

            <Button color="primary" variant="contained" onClick={handleApplyFilters}>
              Apply
            </Button>
          </Box>
        </Box>
      </CustomPopover>
    </>
  );
};
