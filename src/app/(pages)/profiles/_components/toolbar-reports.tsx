import { Button, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { hosts } from '@prisma/client';
import { paths } from 'src/routes/paths';
import { generateLookerStudioUrl } from 'src/sections/host/utils';

export const ToolBarReports = ({ selectedRows }: { selectedRows: hosts[] }) => {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopySharableReport = (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = selectedRows.map((host) => host.token.access);
    const relativeUrl = paths.sharable.overview(access.join(','));
    const fullUrl = `${window.location.origin}${relativeUrl}`;
    copy(fullUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToSharableReportUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = selectedRows.map((host) => host.token.access).join(',');
    const generatedUrl = paths.sharable.overview(access);
    window.open(generatedUrl, '_blank');
  };

  const handleCopyWhiteLabelReport = (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = selectedRows.map((host) => host.token.access);
    const generatedUrl = generateLookerStudioUrl(access);
    copy(generatedUrl);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToWhiteLabelReportUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = selectedRows.map((host) => host.token.access);
    const generatedUrl = generateLookerStudioUrl(access);
    window.open(generatedUrl, '_blank');
  };

  console.log({ access: selectedRows.map((host) => host.token.access) });

  return (
    <>
      <Button
        size="small"
        color="primary"
        onClick={handleCopySharableReport}
        startIcon={<Iconify icon="uil:copy" />}
      >
        Copy Sharable Report [{selectedRows.length}]
      </Button>

      <Button
        size="small"
        color="primary"
        onClick={handleGoToSharableReportUrl}
        startIcon={<Iconify icon="humbleicons:external-link" />}
      >
        Open Sharable Report [{selectedRows.length}]
      </Button>

      <Divider orientation="vertical" color="#003087" flexItem sx={{ mx: 2 }} />

      <Button
        size="small"
        color="primary"
        onClick={handleCopyWhiteLabelReport}
        startIcon={<Iconify icon="uil:copy" />}
      >
        Copy White Label Report [{selectedRows.length}]
      </Button>

      <Button
        size="small"
        color="primary"
        onClick={handleGoToWhiteLabelReportUrl}
        startIcon={<Iconify icon="humbleicons:external-link" />}
      >
        Open White Label Report [{selectedRows.length}]
      </Button>
    </>
  );
};
