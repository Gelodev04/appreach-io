import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { GridCellParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellDateAdded({ params }: ParamsProps) {
  return (
    <Typography variant="body2" sx={{ my: 2 }}>
      {params.row.dateAdded}
    </Typography>
  );
}

export function RenderCellImportName({ params }: ParamsProps) {
  return <Typography variant="body2">{params.row.name}</Typography>;
}

export function RenderCellGenerateTotal({ params }: ParamsProps) {
  return <Typography variant="body2">{params.row.generateTotal}</Typography>;
}

export function RenderCellResultsTotal({ params }: ParamsProps) {
  return <Typography variant="body2">{params.row.resultsTotal}</Typography>;
}

export function RenderCellToken({ params }: ParamsProps) {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    copy(params.row.token);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="body2">{params.row.token}</Typography>
      <Tooltip title="Copy token" placement="top">
        <IconButton onClick={handleCopy} sx={{ zIndex: 20 }}>
          <Iconify icon="uil:copy" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.status === 'success' && 'success') || 'error'}>
      {params.row.status}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
      secondary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Stack>
  );
}
