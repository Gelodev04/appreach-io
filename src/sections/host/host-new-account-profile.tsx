import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { addNewProfile } from 'src/services/db/hosts';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import PopupWarningForAllUsedProfiles from './warning-sender-used-all-profiles';

export const HostNewAccountProfile = ({ isAllProfileUsed }: { isAllProfileUsed: boolean }) => {
  const dialog = useBoolean();
  const theme = useTheme();

  const newHostSchema = Yup.object().shape({
    host: Yup.string()
      .required('Host name is required')
      .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores are allowed')
      .min(1, 'Minimum 1 character')
      .max(15, 'Maximum 15 characters'),
  });

  const defaultValues = {
    host: '',
  };

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (isAllProfileUsed) {
      enqueueSnackbar({
        message: <PopupWarningForAllUsedProfiles />,
        variant: 'warning',
        persist: true,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
      });

      return;
    }

    const response = await addNewProfile(data.host);
    if (!response.success) {
      enqueueSnackbar(response.message, { variant: 'error', persist: true });
    } else {
      enqueueSnackbar('Update success!');
      dialog.onFalse();
    }
  });

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={dialog.onTrue}
      >
        Add new account profile
      </Button>
      <ConfirmDialog
        title="Add new account profile"
        hideCancelButton
        open={dialog.value}
        hideActions
        onClose={() => {
          dialog.onFalse();
        }}
        content={
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <RHFTextField
                name="host"
                label="Profile name"
                placeholder="Profile name"
                sx={{ mt: 1 }}
              />
              <Typography variant="subtitle2">Input Field Requirements:</Typography>
              <Typography component="ul">
                <Typography component="li">1-15 characters</Typography>
                <Typography component="li">Lowercase letters (a-z)</Typography>
                <Typography component="li">Numbers (0-9)</Typography>
                <Typography component="li">
                  Underscores (_) only, no spaces or special characters
                </Typography>
              </Typography>
            </Box>{' '}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 3 }}>
              <Button variant="outlined" onClick={dialog.onFalse}>
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ ml: 2, boxShadow: theme.customShadows.primary }}
              >
                Add profile
              </LoadingButton>
            </Box>
          </FormProvider>
        }
      />
    </>
  );
};
