import { Button, TextField } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useAddExistingHost } from './hooks';
import PopupWarningForAllUsedProfiles from './warning-sender-used-all-profiles';

export default function HostAddExistingHost({
  isAllSenderProfilesUsed,
}: {
  isAllSenderProfilesUsed: boolean;
}) {
  const { addExistingHost, submitting, hostName, setHostName, open } = useAddExistingHost();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickAddExistingAccountProfile = () => {
    if (isAllSenderProfilesUsed) {
      enqueueSnackbar({
        message: <PopupWarningForAllUsedProfiles />,
        variant: 'warning',
        persist: true,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
      });
      return null;
    }

    open.onTrue();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={handleClickAddExistingAccountProfile}
      >
        Add an existing account profile
      </Button>
      <ConfirmDialog
        title="Add an existing sender profile"
        open={open.value}
        onClose={() => {
          open.onFalse();
          setHostName('');
        }}
        content={
          <TextField
            fullWidth
            sx={{ mt: 1 }}
            placeholder="crypt"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
          />
        }
        action={
          <Button variant="contained" onClick={addExistingHost} disabled={!hostName || submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        }
      />
    </>
  );
}
