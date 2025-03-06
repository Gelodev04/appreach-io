'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { getHubspotAuthUrl } from 'src/services/db/hubspot';
import { HubspotOAuthDropdown } from './hubspot-oauth-dropdown';

type OptionType = {
  profile: string;
  id: string;
}[];

export const HubspotHeader = ({ allHosts }: { allHosts: OptionType }) => {
  const hubspotOAuth = useBoolean();
  const [item, setItem] = useState('');

  const handleHubspotAuth = async () => {
    if (!item) {
      enqueueSnackbar('Please select a host before proceeding.', { variant: 'error' });
      return;
    }

    try {
      const authUrl = await getHubspotAuthUrl();

      // Add `state` to preserve host selection
      const stateParam = encodeURIComponent(JSON.stringify({ host: item }));
      const authUrlWithState = `${authUrl}&state=${stateParam}`;

      window.location.href = authUrlWithState;
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <CustomBreadcrumbs
      heading="Hubspot Campaigns"
      links={[{ name: 'Hubspot Campaigns' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button variant="contained">Settings</Button>
          <Button variant="contained" color="primary" onClick={hubspotOAuth.onTrue}>
            oAuth Setup
          </Button>

          <ConfirmDialog
            open={hubspotOAuth.value}
            onClose={hubspotOAuth.onFalse}
            title="Setup Hubspot oAuth"
            content={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">Choose a host</Typography>
                <Typography variant="body2" color="GrayText">
                  The oAuth will be saved this profile
                </Typography>
                <HubspotOAuthDropdown options={allHosts} item={item} setItem={setItem} />
              </Box>
            }
            action={
              <Button variant="contained" color="primary" onClick={handleHubspotAuth}>
                Submit
              </Button>
            }
          />
        </Stack>
      }
    />
  );
};
