import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { GridCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { paths } from 'src/routes/paths';
import { generateLookerStudioUrl } from './utils';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderLookerStudioUrl({ params }: ParamsProps) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const { access } = params.row.token;
    const generatedUrl = await generateLookerStudioUrl([access as string]);
    copy(generatedUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToUrl = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const { access } = params.row.token;
    const generatedUrl = await generateLookerStudioUrl([access as string]);
    window.open(generatedUrl, '_blank');
  };

  return (
    <Stack direction="row">
      <Tooltip title="Copy url" placement="top">
        <Button
          onClick={handleCopy}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="uil:copy" />}
        >
          Copy
        </Button>
      </Tooltip>
      <Tooltip title="Go to url" placement="top">
        <Button
          onClick={handleGoToUrl}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="humbleicons:external-link" />}
        >
          Open
        </Button>
      </Tooltip>
    </Stack>
  );
}

export function RenderSharableReportURL({ params }: ParamsProps) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    const { access } = params.row.token;
    const relativeUrl = paths.sharable.overview(access);
    const fullUrl = `${window.location.origin}${relativeUrl}`;
    console.log({ fullUrl });
    copy(fullUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    const { access } = params.row.token;
    const generatedUrl = paths.sharable.overview(access);
    window.open(generatedUrl, '_blank');
  };

  return (
    <Stack direction="row">
      <Tooltip title="Copy url" placement="top">
        <Button
          onClick={handleCopy}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="uil:copy" />}
        >
          Copy
        </Button>
      </Tooltip>
      <Tooltip title="Go to url" placement="top">
        <Button
          onClick={handleGoToUrl}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="humbleicons:external-link" />}
        >
          Open
        </Button>
      </Tooltip>
    </Stack>
  );
}

export const SeedActionCells = ({ params }: ParamsProps) => {
  const router = useRouter();
  const handleEditSeedsRow = () => {
    router.push(paths.profiles.seeds(params.id.toString()));
  };

  const handleEditNotificationsRow = () => {
    router.push(paths.profiles.notifications(params.id.toString()));
  };

  return (
    <Stack direction="row">
      {/* Seeds no longer being used as of July 2025 so this section has been removed */}
      {/* <Tooltip title="Edit seed settings" placement="top">
        <Button
          onClick={handleEditSeedsRow}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="mdi:seed-outline" />}
        >
          Settings
        </Button>
      </Tooltip> */}
      <Tooltip title="Edit sender address" placement="top">
        <Button
          onClick={handleEditNotificationsRow}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="hugeicons:address-book" />}
        >
          Notifications
        </Button>
      </Tooltip>
    </Stack>
  );
};
