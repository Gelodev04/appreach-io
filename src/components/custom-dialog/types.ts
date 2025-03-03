import { DialogProps } from '@mui/material/Dialog';

// ----------------------------------------------------------------------

export type ConfirmDialogProps = Omit<DialogProps, 'title' | 'content'> & {
  title: React.ReactNode;
  content?: React.ReactNode;
  action?: React.ReactNode;
  hideCancelButton?: boolean;
  hideActions?: boolean;
  onClose: VoidFunction;
};
