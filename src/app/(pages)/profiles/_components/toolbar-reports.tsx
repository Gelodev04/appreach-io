import { Button, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { hosts } from '@prisma/client';
import { useHostTokenUtils } from '../_hooks/useHostTokenUtils';

export const ToolBarReports = ({ selectedRows }: { selectedRows: hosts[] }) => {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const { extractValidTokens, getSharableUrl, getLookerUrl } = useHostTokenUtils();

  const handleCopySharableReport = (event: React.MouseEvent) => {
    event.stopPropagation();
    const tokens = extractValidTokens(selectedRows, true);
    copy(getSharableUrl(tokens));
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToSharableReportUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    const tokens = extractValidTokens(selectedRows);
    window.open(getSharableUrl(tokens), '_blank');
  };

  const handleCopyWhiteLabelReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tokens = extractValidTokens(selectedRows, true);
    copy(getLookerUrl(tokens));
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  const handleGoToWhiteLabelReportUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tokens = extractValidTokens(selectedRows);
    window.open(getLookerUrl(tokens), '_blank');
  };

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
