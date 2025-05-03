import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  hideCancelButton,
  isLoading,
  hideActions,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={(event, reason) => {
        if (isLoading && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
          return;
        }
        onClose?.(event, reason); // allow close if not loading
      }}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      {!hideActions && (
        <DialogActions>
          {!hideCancelButton && (
            <Button disabled={isLoading} variant="outlined" color="inherit" onClick={onClose}>
              Cancel
            </Button>
          )}
          {action}
        </DialogActions>
      )}
    </Dialog>
  );
}
