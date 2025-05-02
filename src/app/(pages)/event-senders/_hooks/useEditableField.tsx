import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';

type UseEditableFieldProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  selectedRowIds: string[];
  onUpdate: (ids: string[], newValue: string) => Promise<any>;
};

export const useEditableField = ({
  label,
  value,
  options,
  selectedRowIds,
  onUpdate,
}: UseEditableFieldProps) => {
  const [isUpdating, startUpdate] = useTransition();
  const popover = usePopover();
  const confirm = useBoolean();

  const handleSave = () => {
    const selected = options.find((opt) => opt.value === value);
    if (!selected) {
      enqueueSnackbar(`Select a ${label}`, { variant: 'error', persist: true });
      return;
    }

    startUpdate(async () => {
      const response = await onUpdate(selectedRowIds, selected.value);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar(`${label} update success!`);
        popover.onClose();
        confirm.onFalse();
      }
    });
  };

  return {
    isUpdating,
    popover,
    confirm,
    handleSave,
    selectedLabel: options.find((opt) => opt.value === value)?.label,
  };
};
