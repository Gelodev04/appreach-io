'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { smartleadAccountsWebhook } from 'src/services/db/smartlead';
import { useSmartleadSyncStore } from 'src/store/smartlead';
import { SmartleadSyncDropdown } from './smartlead-sync-dropdown';

type OptionType = {
  profile: string;
  id: string;
}[];

export const SmartleadHeader = ({ options }: { options: OptionType }) => {
  const syncAccounts = useBoolean();
  const { smartlead } = useSmartleadSyncStore();
  const [isPending, startTransition] = useTransition();

  const handleSyncAccounts = async () => {
    if (!smartlead) {
      console.log('No host selected.');
      return;
    }

    startTransition(async () => {
      const response = await smartleadAccountsWebhook(smartlead);

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: false });
      } else {
        enqueueSnackbar('Syncing successful!');
      }
    });
  };

  return (
    <CustomBreadcrumbs
      heading="SmartLead Accounts"
      links={[{ name: 'SmartLead Setup' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button variant="contained">Configure Integration</Button>
          <Button variant="contained" color="primary" onClick={syncAccounts.onTrue}>
            Sync Accounts
          </Button>

          <ConfirmDialog
            open={syncAccounts.value}
            onClose={syncAccounts.onFalse}
            title="Sync Accounts"
            content={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">Choose a host</Typography>
                <Typography variant="body2" color="GrayText">
                  This host&apos;s API key will be used
                </Typography>
                <SmartleadSyncDropdown options={options} />
              </Box>
            }
            action={
              <Button
                variant="contained"
                color="primary"
                onClick={handleSyncAccounts}
                disabled={isPending}
              >
                Sync Account
              </Button>
            }
          />
        </Stack>
      }
    />
  );
};
