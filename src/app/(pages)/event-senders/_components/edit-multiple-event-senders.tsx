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
import { EditPopover } from 'src/components/custom-popover/dropdown-edit-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  deleteMultipleSenderAccountsById,
  updateMultipleSenderAccountsHost,
  updateMultipleSenderAccountsPlatform,
  updateMultipleSenderAccountsReseller,
  updateMultipleSenderAccountsServer,
  updateMultipleSenderAccountsType,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';

export const EditMultipleEventSenders = ({
  selectedRowIds,
  emailServerOptions,
  emailResellerOptions,
  platformOptions,
  typeOptions,
  hostOptions,
}: {
  selectedRowIds: GridRowSelectionModel;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  platformOptions: PlatformOptionsType;
  typeOptions: PlatformOptionsType;
  hostOptions: HostOptionsType;
}) => {
  const [isDeleting, startDeleting] = useTransition();
  const [isEmailServerUpdating, startEmailServerUpdate] = useTransition();
  const [isEmailResellerUpdating, startEmailResellerUpdate] = useTransition();
  const [isPlatformUpdating, startPlatformUpdate] = useTransition();
  const [isTypeUpdating, startTypeUpdate] = useTransition();
  const [isHostUpdating, startHostUpdate] = useTransition();
  const [value, setValue] = useState({
    emailServer: '',
    emailReseller: '',
    platform: '',
    type: '',
    host: '',
  });

  const emailServerPopover = usePopover();
  const emailResellerPopover = usePopover();
  const platformPopover = usePopover();
  const typePopover = usePopover();
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
        selectedServer.value
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        emailServerPopover.onClose();
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
        selectedReseller.value
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        emailResellerPopover.onClose();
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
        selectedPlatform.value
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Platform update success!');
        platformPopover.onClose();
      }
    });
  };

  const handleSaveType = () => {
    const selectedType = typeOptions.find((type) => type.value === value.type);
    if (!selectedType) {
      enqueueSnackbar('Select a type', { variant: 'error', persist: true });
      return;
    }

    startTypeUpdate(async () => {
      const response = await updateMultipleSenderAccountsType(
        selectedRowIds as string[],
        selectedType.value
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Type update success!');
        typePopover.onClose();
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
        selectedHost.profile
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
      await deleteMultipleSenderAccountsById(selectedRowIds as string[]);
      confirmDelete.onFalse();
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isEmailServerUpdating}
        onClick={emailServerPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Email Server [{selectedRowIds.length}]
      </Button>

      <Button
        size="medium"
        color="primary"
        disabled={isEmailResellerUpdating}
        onClick={emailResellerPopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Email Reseller [{selectedRowIds.length}]
      </Button>

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
        disabled={isTypeUpdating}
        onClick={typePopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Type [{selectedRowIds.length}]
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
      <EditPopover
        open={emailServerPopover.open}
        onClose={emailServerPopover.onClose}
        label="Email Server"
        value={value.emailServer}
        options={emailServerOptions}
        loading={isEmailServerUpdating}
        onChange={handleChange}
        onSave={handleSaveEmailServer}
        name="emailServer"
      />
      <EditPopover
        open={emailResellerPopover.open}
        onClose={emailResellerPopover.onClose}
        label="Email Reseller"
        value={value.emailReseller}
        options={emailResellerOptions}
        loading={isEmailResellerUpdating}
        onChange={handleChange}
        onSave={handleSaveEmailReseller}
        name="emailReseller"
      />
      <EditPopover
        open={typePopover.open}
        onClose={typePopover.onClose}
        label="Type"
        value={value.type}
        options={typeOptions}
        loading={isTypeUpdating}
        onChange={handleChange}
        onSave={handleSaveType}
        name="type"
      />
      <EditPopover
        open={platformPopover.open}
        onClose={platformPopover.onClose}
        label="Platform"
        value={value.platform}
        options={platformOptions}
        loading={isPlatformUpdating}
        onChange={handleChange}
        onSave={handleSavePlatform}
        name="platform"
      />
      <CustomPopover arrow="top-center" open={hostPopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Assigned Profile
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
