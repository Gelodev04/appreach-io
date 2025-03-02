import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GridCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { paths } from 'src/routes/paths';
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
  const handleEditSeedsRow = useCallback(() => {
    router.push(paths.settings.seeds(params.id.toString()));
  }, [router]);

  const handleEditSenderRow = useCallback(() => {
    router.push(paths.senders.filter(params.id.toString()));
  }, [router]);

  return (
    <Stack direction="row">
      <Tooltip title="Edit seed settings" placement="top">
        <Button
          onClick={handleEditSeedsRow}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="mdi:seed-outline" />}
        >
          Settings
        </Button>
      </Tooltip>
      <Tooltip title="Edit sender address" placement="top">
        <Button
          onClick={handleEditSenderRow}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="material-symbols:settings-account-box-outline-sharp" />}
        >
          Senders
        </Button>
      </Tooltip>
    </Stack>
  );
};

export const AttributeActionCells = ({ params }: ParamsProps) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
    router.push(paths.attributesUpload.root);
  }, [router]);

  return (
    <Stack direction="row">
      <Tooltip title="Open attributes list" placement="top">
        <Button
          onClick={handleClick}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="material-symbols:featured-play-list-outline" />}
        >
          Lists
        </Button>
      </Tooltip>
    </Stack>
  );
};

export const SmartleadActionCells = ({ params }: ParamsProps) => {
  const router = useRouter();
  const handleEditSmartleadRow = useCallback(() => {
    router.push(paths.settings.smartlead(params.id.toString()));
  }, [router]);

  const handleOpenSmartlead = useCallback(() => {
    router.push(paths.smartlead.root);
  }, [router]);

  return (
    <Stack direction="row">
      <Tooltip title="Edit smartlead" placement="top">
        <Button
          onClick={handleEditSmartleadRow}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="humbleicons:share-alt" />}
        >
          Settings
        </Button>
      </Tooltip>
      <Tooltip title="Open smartlead emails" placement="top">
        <Button
          onClick={handleOpenSmartlead}
          sx={{ zIndex: 20, color: '#637381' }}
          startIcon={<Iconify icon="material-symbols:stacked-email-outline" />}
        >
          Emails
        </Button>
      </Tooltip>
    </Stack>
  );
};
