// import Link from '@mui/material/Link';
import Link from 'next/link';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { GridCellParams } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderHostName({ params }: ParamsProps) {
  return (
    <Link href={paths.dashboard.hosts.edit}>
      <Typography variant="subtitle1" color="default" sx={{ my: 2 }}>
        {params.row.name}
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
    window.open(params.row.lookerStudioUrl, '_blank');
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
