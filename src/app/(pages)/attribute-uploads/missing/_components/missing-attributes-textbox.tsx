import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useMissingAttributesStore } from '../_hooks/useMissingAttributesStore';

type Props = {
  params: GridCellParams;
  attributeType: 'person' | 'company';
  type?: React.HTMLInputTypeAttribute;
};

export const MissingAttributesTextbox = ({ params, attributeType, type }: Props) => {
  const { setFieldValue, unsaved, editedValues, clearFieldChange } =
    useMissingAttributesStore(attributeType);

  const rowId = params.row.id;
  const field = params.field;
  const initial = params.value?.toString() || '';

  // Use edited value if exists, else fallback to initial
  const displayValue = editedValues[rowId]?.[field] ?? initial;

  const [value, setValue] = useState(displayValue);

  // dirty if unsaved has this field in this row
  const dirty = unsaved[rowId]?.[field] !== undefined;

  const debouncedSetFieldValue = useMemo(() => {
    return debounce((val: string) => {
      const trimmed = val.trim();
      const trimmedInitial = initial.trim();
      setFieldValue(rowId, field, trimmed, trimmedInitial);
    }, 300);
  }, [rowId, field, setFieldValue, initial]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      setValue(newVal);
      debouncedSetFieldValue(newVal);
    },
    [debouncedSetFieldValue]
  );

  const handleReset = useCallback(() => {
    const trimmedInitial = initial.trim();
    setValue(trimmedInitial);
    setFieldValue(rowId, field, trimmedInitial, trimmedInitial);
    clearFieldChange(rowId, field);
    debouncedSetFieldValue.cancel();
  }, [rowId, field, initial, setFieldValue, debouncedSetFieldValue]);

  useEffect(() => {
    setValue(displayValue);
  }, [displayValue]);

  useEffect(() => {
    return () => {
      debouncedSetFieldValue.cancel();
    };
  }, [debouncedSetFieldValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'a') e.stopPropagation();
    if (e.key === ' ' && !e.ctrlKey && !e.altKey && !e.metaKey) e.stopPropagation();
    if (['Delete', 'Backspace'].includes(e.key)) e.stopPropagation();
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.stopPropagation();
  };

  return (
    <Tooltip title={dirty ? 'You have unsaved changes' : ''}>
      <TextField
        type={type}
        value={value}
        error={dirty}
        onBlur={() => setValue(value.trim())}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        sx={{
          backgroundColor: !value ? '#fefce8' : 'background.paper',
          marginTop: 2,
          marginBottom: 2,
        }}
        InputProps={{
          endAdornment: dirty && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleReset}
                aria-label="Reset to initial value"
                edge="end"
              >
                <Iconify icon="material-symbols:close-rounded" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Tooltip>
  );
};
