import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useMissingAttributesFieldStore } from 'src/store/attribute-uploads';

type Props = {
  params: GridCellParams;
  type?: React.HTMLInputTypeAttribute;
};

export const MissingAttributesTextbox = ({ params, type }: Props) => {
  const { setFieldValue, unsaved, editedValues, clearFieldChange } =
    useMissingAttributesFieldStore();
  const rowId = params.row.id;
  const field = params.field;

  // 1. Get the most up-to-date "saved" value from the store.
  //    Fallback to the initial params.value if not in the store yet.
  const savedValue = useMemo(
    () => editedValues[rowId]?.[field]?.toString() ?? params.value?.toString() ?? '',
    [editedValues, rowId, field, params.value]
  );

  // 2. The local state should be initialized with this up-to-date value.
  const [value, setValue] = useState(savedValue);

  // 3. The `dirty` state is determined by checking the `unsaved` store.
  const dirty = unsaved[rowId]?.[field] !== undefined;

  // 4. Re-create the debounced function ONLY when the `savedValue` changes.
  const debouncedSetFieldValue = useMemo(() => {
    return debounce((val: string) => {
      // Compare the new value with the *current* saved value, not the original one.
      setFieldValue(rowId, field, val, String(savedValue).trim());
    }, 300);
  }, [rowId, field, setFieldValue, savedValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      setValue(newVal);
      debouncedSetFieldValue(newVal);
    },
    [debouncedSetFieldValue]
  );

  const handleReset = useCallback(() => {
    // Reset to the most recent saved value.
    setValue(savedValue);
    setFieldValue(rowId, field, savedValue, savedValue);
    clearFieldChange(rowId, field);
    debouncedSetFieldValue.cancel();
  }, [rowId, field, savedValue, setFieldValue, debouncedSetFieldValue, clearFieldChange]);

  const handleBlur = () => {
    debouncedSetFieldValue.cancel();
    const trimmedValue = value.trim();

    setValue(trimmedValue);

    setFieldValue(rowId, field, trimmedValue, String(savedValue).trim());
  };

  // 5. Effect to sync local state if the underlying saved value changes (e.g., from an external update)
  useEffect(() => {
    // Only update the input if it's not currently being edited (not dirty)
    if (!dirty) {
      setValue(savedValue);
    }
  }, [savedValue, dirty]);

  useEffect(() => {
    return () => {
      debouncedSetFieldValue.cancel();
    };
  }, [debouncedSetFieldValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <Tooltip title={dirty ? 'You have unsaved changes' : ''}>
      <TextField
        type={type}
        value={value}
        error={dirty}
        onBlur={handleBlur}
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
