import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

export const RHFDateTimePicker = ({ name, label }: { name: string; label: string }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={dayjs()}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            {...field}
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => field.onChange(date ? dayjs(date) : null)}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
              popper: {
                sx: {
                  '& *::-webkit-scrollbar': {
                    display: 'none',
                  },
                  '& *': {
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};
