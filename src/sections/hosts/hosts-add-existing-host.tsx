import { Button, TextField } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

export default function HostsAddExistingHost() {
  const open = useBoolean(false);
  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={open.onTrue}
      >
        Add an existing host
      </Button>
      <ConfirmDialog
        title="Add an existing host"
        open={open.value}
        onClose={open.onFalse}
        content={<TextField fullWidth sx={{ mt: 1 }} placeholder="host-name" />}
        action={
          <Button variant="contained" onClick={open.onFalse}>
            Submit
          </Button>
        }
      />
    </>
  );
}
