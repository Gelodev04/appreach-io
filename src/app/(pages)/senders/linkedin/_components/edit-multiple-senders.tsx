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
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import {
  deleteMultipleSenderAccountsById,
  updateMultipleSenderAccountsHost,
  updateMultipleSenderAccountsPlatform,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';

export const EditMutipleSenders = ({
  selectedRowIds,
  hostOptions,
  platformOptions,
}: {
  hostOptions: HostOptionsType;
  platformOptions: PlatformOptionsType;
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isDeleting, startDeleting] = useTransition();
  const [isPlatformUpdating, startPlatformUpdate] = useTransition();
  const [isHostUpdating, startHostUpdate] = useTransition();
  const [value, setValue] = useState({ host: '', platform: '' });

  const hostPopover = usePopover();
  const platformPopover = usePopover();
  const confirmDelete = useBoolean();

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveHost = () => {
    const selectedHost = hostOptions.find((host) => host.id === value.host);
    if (!selectedHost) {
      enqueueSnackbar('Select a host', { variant: 'error', persist: true });
      return;
    }

    startHostUpdate(async () => {
      const response = await updateMultipleSenderAccountsHost(
        selectedRowIds as string[],
        selectedHost.id,
        selectedHost.profile,
        paths.senders.linkedin
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Host update success!');
        hostPopover.onClose();
      }
    });
  };

  const handleSavePlatform = () => {
    const selectedPlatform = platformOptions.find((platform) => platform.value === value.platform);
    if (!selectedPlatform) {
      enqueueSnackbar('Select a platform', { variant: 'error', persist: true });
      return;
    }

    startPlatformUpdate(async () => {
      const response = await updateMultipleSenderAccountsPlatform(
        selectedRowIds as string[],
        selectedPlatform.value,
        paths.senders.linkedin
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        hostPopover.onClose();
      }
    });
  };

  const handleDeleteLinkedinSenders = () => {
    startDeleting(async () => {
      await deleteMultipleSenderAccountsById(selectedRowIds as string[], paths.senders.linkedin);
      confirmDelete.onFalse();
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isPlatformUpdating}
        onClick={platformPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Platform [{selectedRowIds.length}]
      </Button>

      <Button
        size="medium"
        color="primary"
        disabled={isHostUpdating}
        onClick={hostPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Assigned Profile [{selectedRowIds.length}]
      </Button>

      <Button
        size="small"
        color="error"
        onClick={confirmDelete.onTrue}
        disabled={isDeleting}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        {isDeleting ? `Deleting...` : `Delete [${selectedRowIds.length}]`}
      </Button>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content={<>You are about to delete [{selectedRowIds.length}] Linkedin Users</>}
        action={
          <Button
            variant="contained"
            color="error"
            disabled={isDeleting}
            onClick={handleDeleteLinkedinSenders}
          >
            Delete
          </Button>
        }
      />

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
              disabled={isHostUpdating}
              onChange={handleChange}
            >
              {hostOptions.map((profile) => (
                <MenuItem value={profile.id} key={profile.id}>
                  {profile.profile}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            color="primary"
            variant="contained"
            disabled={isHostUpdating}
            onClick={handleSaveHost}
          >
            Save changes
          </Button>
        </Box>
      </CustomPopover>

      <CustomPopover arrow="top-center" open={platformPopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Platform
            </Typography>
            <IconButton onClick={platformPopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color="GrayText">
              Platform
            </Typography>
            <Select
              sx={{
                width: '100%',
              }}
              name="platform"
              value={value.platform}
              disabled={isPlatformUpdating}
              onChange={handleChange}
            >
              {platformOptions.map((platform) => (
                <MenuItem value={platform.value} key={platform.value}>
                  {platform.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            color="primary"
            variant="contained"
            disabled={isPlatformUpdating}
            onClick={handleSavePlatform}
          >
            Save changes
          </Button>
        </Box>
      </CustomPopover>
    </>
  );
};
