import { useState, useCallback } from 'react';

import { useGetHosts } from 'src/hooks/api/host';
import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/swr';

import { useSnackbar } from 'src/components/snackbar';

// --------------------------------------------------------

export const useAddExistingHost = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { revalidateHosts } = useGetHosts();

  const [hostName, setHostName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const open = useBoolean(false);

  const addExistingHost = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch(endpoints.host.addExistingHost, {
        method: 'POST',
        body: JSON.stringify({ hostName }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error);
      }
      await revalidateHosts();
      enqueueSnackbar('Host added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      open.onFalse();
      setHostName('');
      setSubmitting(false);
    }
  }, [hostName, revalidateHosts, enqueueSnackbar, open]);

  return { addExistingHost, submitting, hostName, setHostName, open };
};
