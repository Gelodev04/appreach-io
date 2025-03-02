import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { addNewProfile } from 'src/services/db/hosts';
import PopupWarningForAllUsedProfiles from './warning-sender-used-all-profiles';

export const HostNewAccountProfile = ({ isAllProfileUsed }: { isAllProfileUsed: boolean }) => {
  const dialog = useBoolean();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hostName, setHostName] = useState('');

  const handleAddProfile = () => {
    startTransition(async () => {
      if (isAllProfileUsed) {
        enqueueSnackbar({
          message: <PopupWarningForAllUsedProfiles />,
          variant: 'warning',
          persist: true,
          anchorOrigin: {
            horizontal: 'center',
            vertical: 'top',
          },
        });

        return;
      }

      const response = await addNewProfile(hostName);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Update success!');
        router.push(paths.settings.root);
      }
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={dialog.onTrue}
      >
        Add new account profile
      </Button>
      <ConfirmDialog
        title="Add new account profile"
        open={dialog.value}
        onClose={() => {
          dialog.onFalse();
        }}
        content={
          <TextField
            fullWidth
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="Profile name"
          />
        }
        action={
          <Button onClick={handleAddProfile} variant="contained" disabled={!hostName || isPending}>
            Add profile
          </Button>
        }
      />
    </>
  );
};
