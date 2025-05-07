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
import {
  deleteMultipleSenderAccountsById,
  updateMultipleSenderAccountsHost,
  updateMultipleSenderAccountsPlatform,
  updateMultipleSenderAccountsReseller,
  updateMultipleSenderAccountsServer,
  updateMultipleSenderAccountsType,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { useEditableField } from '../_hooks/useEditableField';
import { BulkEditSenderName } from './BulkEditSenderName';
import { ConfirmEditPopover } from './confirm-edit-popover';

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
  const [isHostUpdating, startHostUpdate] = useTransition();
  const [value, setValue] = useState({
    emailServer: '',
    emailReseller: '',
    platform: '',
    type: '',
    host: '',
  });
  const hostPopover = usePopover();

  const confirmDelete = useBoolean();
  const confirmEditHost = useBoolean();

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
        selectedHost.profile
      );

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Host update success!');
        hostPopover.onClose();
        confirmEditHost.onFalse();
      }
    });
  };

  const handleDeleteLinkedinSenders = () => {
    startDeleting(async () => {
      await deleteMultipleSenderAccountsById(selectedRowIds as string[]);
      confirmDelete.onFalse();
    });
  };

  const emailServerField = useEditableField({
    label: 'Email Server',
    value: value.emailServer,
    options: emailServerOptions,
    selectedRowIds: selectedRowIds as string[],
    onUpdate: updateMultipleSenderAccountsServer,
  });

  const emailResellerField = useEditableField({
    label: 'Email Reseller',
    value: value.emailReseller,
    options: emailResellerOptions,
    selectedRowIds: selectedRowIds as string[],
    onUpdate: updateMultipleSenderAccountsReseller,
  });

  const platformField = useEditableField({
    label: 'Platform',
    value: value.platform,
    options: platformOptions,
    selectedRowIds: selectedRowIds as string[],
    onUpdate: updateMultipleSenderAccountsPlatform,
  });

  const typeField = useEditableField({
    label: 'Type',
    value: value.type,
    options: typeOptions,
    selectedRowIds: selectedRowIds as string[],
    onUpdate: updateMultipleSenderAccountsType,
  });

  return (
    <>
      <BulkEditSenderName selectedRowIds={selectedRowIds} />

      <ConfirmEditPopover
        field={emailServerField}
        name="emailServer"
        label="Email Server"
        value={value.emailServer}
        options={emailServerOptions}
        onChange={handleChange}
        selectedCount={selectedRowIds.length}
      />

      <ConfirmEditPopover
        field={emailResellerField}
        name="emailReseller"
        label="Email Reseller"
        value={value.emailReseller}
        options={emailResellerOptions}
        onChange={handleChange}
        selectedCount={selectedRowIds.length}
      />

      <ConfirmEditPopover
        field={platformField}
        name="platform"
        label="Platform"
        value={value.platform}
        options={platformOptions}
        onChange={handleChange}
        selectedCount={selectedRowIds.length}
      />

      <ConfirmEditPopover
        field={typeField}
        name="type"
        label="Type"
        value={value.type}
        options={typeOptions}
        onChange={handleChange}
        selectedCount={selectedRowIds.length}
      />

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
            onClick={confirmEditHost.onTrue}
          >
            Save changes
          </Button>
        </Box>
      </CustomPopover>

      <ConfirmDialog
        open={confirmEditHost.value}
        onClose={confirmEditHost.onFalse}
        title="Update Assigned Profile"
        content={
          <>
            You are about to update the <b>Assigned Profile</b> to{' '}
            <b>{hostOptions.find((val) => value.host === val.id)?.profile}</b> for{' '}
            <b>{selectedRowIds.length} account/s</b>.
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            disabled={isHostUpdating}
            onClick={handleSaveHost}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
};
