'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Label from 'src/components/label';
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
  const [data, setData] = useState<Record<string, any>>({});

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
        enqueueSnackbar('Sync successful');
        setData(response.data);
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

                {Object.keys(data).length > 0 && (
                  <Label variant="soft" color="success">
                    {data.added} accounts added | {data.updated} accounts updated.
                  </Label>
                )}
              </Box>
            }
            action={
              <Button
                variant="contained"
                color="primary"
                onClick={handleSyncAccounts}
                disabled={isPending}
              >
                {isPending ? 'Syncing Accounts...' : 'Sync Account'}
              </Button>
            }
          />
        </Stack>
      }
    />
  );
};
