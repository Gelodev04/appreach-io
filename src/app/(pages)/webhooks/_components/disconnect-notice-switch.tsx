'use client';

import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Switch } from '@mui/material';
import Label from 'src/components/label';
import axios from 'axios';
import { useWebhookSettingsStore } from 'src/store/webhooks';

interface DisconnectNoticeSwitchProps {
  value: string;
  initialChecked?: boolean;
}

export const DisconnectNoticeSwitch = ({
  value,
  initialChecked = false,
}: DisconnectNoticeSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(initialChecked);
  const { isUpdating, setIsUpdating } = useWebhookSettingsStore((state) => state);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsEnabled(newValue);
    setIsUpdating(true);

    try {
      const response = await axios.post('/api/webhook-notifications', {
        value,
        newValue,
      });

      if (response.data.success) {
        enqueueSnackbar('Saved successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.data.message || 'Failed to save setting', { variant: 'error' });
        setIsEnabled(!newValue); // revert
      }
    } catch (error) {
      enqueueSnackbar('Failed to save setting', { variant: 'error' });
      setIsEnabled(!newValue); // revert
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Switch checked={isEnabled} onChange={handleChange} disabled={isUpdating} />
      <Label>{isEnabled ? 'Enabled' : 'Disabled'}</Label>
    </>
  );
};
