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
  updateMultipleSenderAccounts,
} from 'src/services/db/sender-accounts';

type OptionType = {
  profile: string;
  id: string;
}[];

export const EditMutipleHost = ({
  selectedRowIds,
  options,
}: {
  options: OptionType;
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState({ host: '', esp: '' });

  const hostPopover = usePopover();
  const confirmDelete = useBoolean();

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveHost = () => {
    const selectedHost = options.find((host) => host.id === value.host);
    if (!selectedHost) {
      enqueueSnackbar('Select a host', { variant: 'error', persist: true });
      return;
    }

    startTransition(async () => {
      const response = await updateMultipleSenderAccounts(
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
    startTransition(async () => {
      await deleteMultipleSenderAccountsById(selectedRowIds as string[]);
      confirmDelete.onFalse();
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
        size="small"
        color="error"
        onClick={confirmDelete.onTrue}
        disabled={isPending}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        {isPending ? `Deleting...` : `Delete [${selectedRowIds.length}]`}
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
            disabled={isPending}
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
    </>
  );
};
