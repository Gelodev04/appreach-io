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
import { HostOptionsType } from 'src/types/dropdown-types';

const espOptions = [
  'google business',
  'microsoft business',
  'google personal',
  'microsoft personal',
];

export const MultipleHostEdit = ({
  selectedRowIds,
  options,
}: {
  options: HostOptionsType;
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState({ host: '', esp: '' });

  const hostPopover = usePopover();
  const espPopover = usePopover();

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveHost = () => {
    const selectedHost = options.find((host) => host.id === value.host);
    if (!selectedHost) {
      enqueueSnackbar('Select a host', { variant: 'error', persist: true });
      return;
    }

    const data = {
      hostId: value.host,
      hostName: selectedHost.profile,
      lastUpdated: new Date(),
    };

    startTransition(async () => {
      const response = await updateMultipleSmartlead(selectedRowIds as string[], data);

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Host update success!');
        hostPopover.onClose();
      }
    });
  };
  const handleSaveEsp = () => {
    const selectedEsp = espData[value.esp as keyof typeof espData];
    if (!selectedEsp) {
      enqueueSnackbar('Select an ESP', { variant: 'error', persist: true });
      return;
    }

    const data = {
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
        enqueueSnackbar('ESP update success!');
        espPopover.onClose();
      }
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isPending}
        onClick={hostPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Host [{selectedRowIds.length}]
      </Button>

      <Button
        size="medium"
        color="primary"
        disabled={isPending}
        onClick={espPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit ESP [{selectedRowIds.length}]
      </Button>

      <CustomPopover arrow="top-center" open={hostPopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Host
            </Typography>
            <IconButton onClick={hostPopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

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

          <Button color="primary" variant="contained" disabled={isPending} onClick={handleSaveHost}>
            Save changes
          </Button>
        </Box>
      </CustomPopover>

      <CustomPopover arrow="top-center" open={espPopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit ESP
            </Typography>
            <IconButton onClick={espPopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

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

          <Button color="primary" variant="contained" disabled={isPending} onClick={handleSaveEsp}>
            Save changes
          </Button>
        </Box>
      </CustomPopover>
    </>
  );
};
