import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

export function CopyTextRecord({ txtRecord }: { txtRecord: string }) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    copy(txtRecord);
    enqueueSnackbar('Copied Text Record', { autoHideDuration: 1500 });
  };
  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title={txtRecord} placement="top">
        <Typography variant="body2">{txtRecord}</Typography>
      </Tooltip>

      <Tooltip title="Copy Text Record" placement="top">
        <IconButton onClick={handleCopy} sx={{ zIndex: 20 }}>
          <Iconify icon="uil:copy" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
