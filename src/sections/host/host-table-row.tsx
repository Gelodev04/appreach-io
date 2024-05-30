import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { GridCellParams } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderHostName({ params }: ParamsProps) {
  const href = paths.dashboard.host.edit(params.row._id.toString());

  return (
    <Link component={RouterLink} href={href} color="inherit">
      <Typography variant="subtitle1" sx={{ my: 2 }}>
        {params.row.host}
      </Typography>
    </Link>
  );
}

export function RenderHostCrypt({ params }: ParamsProps) {
  return <Typography>{params.row.hostCrypt}</Typography>;
}

export function RenderLookerStudioUrl({ params }: ParamsProps) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    copy(params.row.lookerStudioUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };
  const handleGoToUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(params.row.lookerStudio.embedUrl, '_blank');
  };
  return (
    <Stack direction="row">
      <Tooltip title="Copy url" placement="top">
        <IconButton onClick={handleCopy} sx={{ zIndex: 20 }}>
          <Iconify icon="uil:copy" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Go to url" placement="top">
        <IconButton onClick={handleGoToUrl} sx={{ zIndex: 20 }}>
          <Iconify icon="humbleicons:external-link" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
