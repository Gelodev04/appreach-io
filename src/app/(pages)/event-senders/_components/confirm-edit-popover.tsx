import { Button, SelectChangeEvent } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { EditPopover } from 'src/components/custom-popover/dropdown-edit-popover';
import Iconify from 'src/components/iconify';
import { useEditableField } from '../_hooks/useEditableField';

type ConfirmEditPopoverProps = {
  field: ReturnType<typeof useEditableField>;
  name: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: SelectChangeEvent<any>) => void;
  selectedCount: number;
};

export const ConfirmEditPopover = ({
  field,
  name,
  label,
  value,
  options,
  onChange,
  selectedCount,
}: ConfirmEditPopoverProps) => (
  <>
    <Button
      size="medium"
      color="primary"
      onClick={field.popover.onOpen}
      disabled={field.isUpdating}
      startIcon={<Iconify icon="flowbite:edit-outline" />}
    >
      Edit {label} [{selectedCount}]
    </Button>

    <EditPopover
      open={field.popover.open}
      onClose={field.popover.onClose}
      label={label}
      name={name}
      value={value}
      options={options}
      loading={field.isUpdating}
      onChange={onChange}
      onSave={field.confirm.onTrue}
    />

    <ConfirmDialog
      open={field.confirm.value}
      onClose={field.confirm.onFalse}
      title={`Update ${label}`}
      content={
        <>
          You are about to update the <b>{label}</b> to <b>{field.selectedLabel}</b> for{' '}
          <b>{selectedCount} account/s</b>.
        </>
      }
      action={
        <Button
          variant="contained"
          color="primary"
          disabled={field.isUpdating}
          onClick={field.handleSave}
        >
          Confirm
        </Button>
      }
    />
  </>
);
