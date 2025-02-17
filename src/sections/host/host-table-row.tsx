import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GridCellParams } from '@mui/x-data-grid';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { generateLookerStudioUrl } from './utils';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderHostName({ params }: ParamsProps) {
  return <Typography sx={{ my: 2 }}>{params.row.host}</Typography>;
}

export function RenderHostCrypt({ params }: ParamsProps) {
  return <Typography>{params.row.hostCrypt}</Typography>;
}

export function RenderLookerStudioUrl({ params }: ParamsProps) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    const { hostCrypt } = params.row;
    const generatedUrl = generateLookerStudioUrl([hostCrypt as string]);
    copy(generatedUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    const { hostCrypt } = params.row;
    const generatedUrl = generateLookerStudioUrl([hostCrypt as string]);
    window.open(generatedUrl, '_blank');
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
