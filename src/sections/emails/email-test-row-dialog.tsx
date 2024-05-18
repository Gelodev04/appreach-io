import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

export default function EmailTestRowDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Stack gap={1} alignItems="center" sx={{ mt: 4 }}>
          <Image
            src="/assets/illustrations/emails/testing-tubes.png"
            width={200}
            height={200}
            alt="seed"
          />
          <Box sx={{ width: '60%' }}>
            <LinearProgress />
          </Box>
          <Typography variant="subtitle1">Testing email account</Typography>
          <Typography variant="body2">This process might take a few minutes.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
