import { useState, useCallback } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, revalidateData } from 'src/utils/swr';

import { useSnackbar } from 'src/components/snackbar';

// --------------------------------------------------------

export const useAddExistingHost = () => {
  const { enqueueSnackbar } = useSnackbar();

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
      await revalidateData(endpoints.host.list);
      enqueueSnackbar('Host added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      open.onFalse();
      setHostName('');
      setSubmitting(false);
    }
  }, [hostName, enqueueSnackbar, open]);

  return { addExistingHost, submitting, hostName, setHostName, open };
};
