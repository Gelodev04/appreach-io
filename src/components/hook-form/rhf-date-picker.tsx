import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

export const RHFDatePicker = ({ name, label }: { name: string; label: string }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={dayjs()} // Ensure this is a `dayjs` object
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...field}
            label={label}
            value={field.value ? dayjs(field.value) : null} // Ensure value is `dayjs`
            onChange={(date) => field.onChange(date ? dayjs(date) : null)} // Ensure consistent format
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};
