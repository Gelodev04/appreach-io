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
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { espData } from 'src/constants';
import { updateMultipleSmartlead } from 'src/services/db/smartlead';

type OptionType = {
  profile: string;
  id: string;
}[];

const espOptions = [
  'google business',
  'microsoft business',
  'google personal',
  'microsoft personal',
];

export const EditMultipleItems = ({
  selectedRowIds,
  options,
}: {
  options: OptionType;
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState({ host: '', esp: '' });
  const popover = usePopover();

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const selectedHost = options.find((host) => host.id === value.host);
    const selectedEsp = espData[value.esp as keyof typeof espData];

    const data = {
      hostId: value.host,
      hostName: selectedHost!.profile,
      esp: selectedEsp.esp,
      espCamelCase: selectedEsp.espCamelCase,
      server: selectedEsp.server,
      lastUpdated: new Date(),
    };

    startTransition(async () => {
      const response = await updateMultipleSmartlead(selectedRowIds as string[], data);

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Update success!');
      }
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isPending}
        onClick={popover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Item [{selectedRowIds.length}]
      </Button>
      <CustomPopover arrow="top-center" open={popover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Items
            </Typography>
            <IconButton onClick={popover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" color="GrayText">
                Host
              </Typography>
              <Select
                sx={{
                  width: '100%',
                }}
                name="host"
                value={value.host}
                disabled={isPending}
                onChange={handleChange}
              >
                {options.map((profile) => (
                  <MenuItem value={profile.id} key={profile.id}>
                    {profile.profile}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" color="GrayText">
                ESP
              </Typography>
              <Select
                sx={{
                  width: '100%',
                }}
                name="esp"
                value={value.esp}
                disabled={isPending}
                onChange={handleChange}
              >
                {espOptions.map((esp) => (
                  <MenuItem value={esp} key={esp}>
                    {esp}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Button color="primary" variant="contained" disabled={isPending} onClick={handleSave}>
            Save changes
          </Button>
        </Box>
      </CustomPopover>
    </>
  );
};
