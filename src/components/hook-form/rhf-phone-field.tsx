import { Box, FormHelperText, InputAdornment, OutlinedInput } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import Iconify from '../iconify';

type Props = TextFieldProps & {
  name: string;
};

interface TextMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMask = forwardRef<HTMLInputElement, TextMaskProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      inputRef={ref}
      mask="(#00) 000-0000"
      definitions={{ '#': /[1-9]/ }}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default function RHFPhoneField({ name }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <OutlinedInput
            {...field}
            fullWidth
            type="tel"
            value={field.value}
            inputComponent={TextMask as any}
            error={!!error}
            endAdornment={
              <InputAdornment position="start">
                <Iconify icon="solar:phone-bold" />
              </InputAdornment>
            }
          />

          {error?.message && (
            <Box mx="14px">
              <FormHelperText error margin="dense">
                {error.message}
              </FormHelperText>
            </Box>
          )}
        </>
      )}
    />
  );
}
