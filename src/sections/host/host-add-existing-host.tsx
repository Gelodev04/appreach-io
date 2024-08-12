import { Button, TextField } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAddExistingHost } from './hooks';

// ------------------------------------------------------------

export default function HostAddExistingHost() {
  const { addExistingHost, submitting, hostName, setHostName, open } = useAddExistingHost();

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={open.onTrue}
      >
        Add an existing infrastructure
      </Button>
      <ConfirmDialog
        title="Add an existing infrastructure"
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
