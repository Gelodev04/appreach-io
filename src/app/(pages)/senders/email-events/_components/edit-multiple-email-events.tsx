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
  updateMultipleSenderAccountsReseller,
  updateMultipleSenderAccountsServer,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';

export const EditMultipleEmailEvents = ({
  selectedRowIds,
  hostOptions,
  platformOptions,
  emailServerOptions,
  emailResellerOptions,
}: {
  hostOptions: HostOptionsType;
  platformOptions: PlatformOptionsType;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isDeleting, startDeleting] = useTransition();
  const [isPlatformUpdating, startPlatformUpdate] = useTransition();
  const [isEmailServerUpdating, startEmailServerUpdate] = useTransition();
  const [isEmailResellerUpdating, startEmailResellerUpdate] = useTransition();
  const [isHostUpdating, startHostUpdate] = useTransition();
  const [value, setValue] = useState({
    host: '',
    platform: '',
    emailServer: '',
    emailReseller: '',
  });

  const emailServer = usePopover();
  const emailReseller = usePopover();
  const platformPopover = usePopover();
  const hostPopover = usePopover();
  const confirmDelete = useBoolean();

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEmailServer = () => {
    const selectedServer = emailServerOptions.find((server) => server.value === value.emailServer);
    if (!selectedServer) {
      enqueueSnackbar('Select an email server', { variant: 'error', persist: true });
      return;
    }

    startEmailServerUpdate(async () => {
      const response = await updateMultipleSenderAccountsServer(
        selectedRowIds as string[],
        selectedServer.value,
        paths.senders.emailEvents
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        emailServer.onClose();
      }
    });
  };

  const handleSaveEmailReseller = () => {
    const selectedReseller = emailResellerOptions.find(
      (reseller) => reseller.value === value.emailReseller
    );
    if (!selectedReseller) {
      enqueueSnackbar('Select an email reseller', { variant: 'error', persist: true });
      return;
    }

    startEmailResellerUpdate(async () => {
      const response = await updateMultipleSenderAccountsReseller(
        selectedRowIds as string[],
        selectedReseller.value,
        paths.senders.emailEvents
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        emailReseller.onClose();
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
        paths.senders.emailEvents
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        platformPopover.onClose();
      }
    });
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
        paths.senders.emailEvents
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Host update success!');
        hostPopover.onClose();
      }
    });
  };

  const handleDeleteLinkedinSenders = () => {
    startDeleting(async () => {
      await deleteMultipleSenderAccountsById(selectedRowIds as string[], paths.senders.emailEvents);
      confirmDelete.onFalse();
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isEmailServerUpdating}
        onClick={emailServer.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Email Server [{selectedRowIds.length}]
      </Button>

      <Button
        size="medium"
        color="primary"
        disabled={isEmailResellerUpdating}
        onClick={emailReseller.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Email Reseller [{selectedRowIds.length}]
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
        content={<>You are about to delete [{selectedRowIds.length}] email events</>}
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

      <CustomPopover arrow="top-center" open={emailServer.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Email Server
            </Typography>
            <IconButton onClick={emailServer.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color="GrayText">
              Email Server
            </Typography>
            <Select
              sx={{
                width: '100%',
              }}
              name="emailServer"
              value={value.emailServer}
              disabled={isEmailServerUpdating}
              onChange={handleChange}
            >
              {emailServerOptions.map((server) => (
                <MenuItem value={server.value} key={server.value}>
                  {server.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            color="primary"
            variant="contained"
            disabled={isEmailServerUpdating}
            onClick={handleSaveEmailServer}
          >
            Save changes
          </Button>
        </Box>
      </CustomPopover>

      <CustomPopover arrow="top-center" open={emailReseller.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Email Reseller
            </Typography>
            <IconButton onClick={emailReseller.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color="GrayText">
              Email Reseller
            </Typography>
            <Select
              sx={{
                width: '100%',
              }}
              name="emailReseller"
              value={value.emailReseller}
              disabled={isEmailResellerUpdating}
              onChange={handleChange}
            >
              {emailResellerOptions.map((reseller) => (
                <MenuItem value={reseller.value} key={reseller.value}>
                  {reseller.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            color="primary"
            variant="contained"
            disabled={isEmailResellerUpdating}
            onClick={handleSaveEmailReseller}
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
    </>
  );
};
