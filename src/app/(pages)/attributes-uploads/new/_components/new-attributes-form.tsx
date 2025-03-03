'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Link, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import UploadDocument from 'src/components/upload/upload-document';
import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import {
  attributeUploadsWebhook,
  createAttributeUploads,
} from 'src/services/db/attributes-uploads';
import { incrementAttributeCreditsUsed } from 'src/services/db/user-settings';
import { CreateAttributeUploadsPropType } from 'src/types/attribute-uploads';
import { parseCSVFile } from 'src/utils/csv-parse';
import { handleFileUpload } from 'src/utils/upload-file-to-signed-url';
import * as Yup from 'yup';

export const NewAttributesForm = ({ remainingCredits }: { remainingCredits: number }) => {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();

  const { hosts } = useGetSeedSettings();
  const { prefillMessage } = useSalesmateChat();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<null | string>(null);

  const router = useRouter();
  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));
  const sourceOptions = [
    { label: 'Apollo', value: 'apollo' },
    { label: 'GrowMeOrganic (Linkedin)', value: 'GrowMeOrganic (Linkedin)' },
  ];

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('List name is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required')
      .nullable()
      .notOneOf([null], 'Sender profile is required'),
    importSource: Yup.object()
      .shape({
        label: Yup.string().required('Import Source label is required'),
        value: Yup.string().required('Import Source value is required'),
      })
      .required('Import Source is required')
      .nullable()
      .notOneOf([null], 'Import Source is required'),
    updateExisting: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: format(new Date(), 'MMM do yyyy'),
      hostId: null,
      importSource: null,
      updateExisting: true,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!file) {
      setFileError('CSV File is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Validate CSV structure
      const result = await parseCSVFile(file);
      const headers = result.meta.fields;

      if (!headers?.some((header: string) => ['email', 'emails'].includes(header.toLowerCase()))) {
        setFileError('CSV file must have an "email" column.');
        return;
      }

      // Upload file to cloud bucket
      const uploadResult = await handleFileUpload(formData, 'attribute');
      if (uploadResult?.error) {
        enqueueSnackbar(uploadResult.error, { variant: 'error', persist: true });
        return;
      }

      // Create document in the database
      const databaseResponse = await createAttributeUploads(
        data as CreateAttributeUploadsPropType,
        uploadResult.url as string
      );

      if (databaseResponse?.error) {
        enqueueSnackbar(databaseResponse.error, { variant: 'error', persist: true });
        return;
      }

      // Increment attribute credits and trigger webhook
      await Promise.all([incrementAttributeCreditsUsed(), attributeUploadsWebhook()]);

      enqueueSnackbar('Uploaded successfully');
      router.push(paths.attributesUpload.root);
      router.refresh();
      setFileError(null);
    } catch (error) {
      console.error('File upload failed', error);
      enqueueSnackbar('An unexpected error occurred during the file upload.', {
        variant: 'error',
        persist: true,
      });
    }
  });

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setFileError(null);
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  name="name"
                  label="List name"
                  placeholder="Assign a name to this list"
                />

                <RHFAutocomplete
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  name="hostId"
                  label="Choose sender profile"
                  placeholder="outreachmagic"
                  options={hostOptions}
                />
              </Box>
              <RHFAutocomplete
                isOptionEqualToValue={(option, value) => option.value === value.value}
                name="importSource"
                label="Sourced from"
                options={sourceOptions}
              />
              <RHFSwitch
                name="updateExisting"
                label="Replace existing attributes with new import name (recommended)"
              />
              <UploadDocument
                file={file}
                fileError={fileError}
                onDrop={handleDrop}
                onDelete={() => setFile(null)}
                accept={{ 'text/csv': [] }}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
            <Image
              src="/assets/illustrations/seeds/person.png"
              alt="seeds"
              width={220}
              height={220}
              priority
              quality={100}
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Upload CSV List
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              You have {remainingCredits} verification credits remaining.{' '}
              <Link component={RouterLink} href={paths.checkout.root} variant="subtitle2">
                Upgrade your subscription
              </Link>
              . Or{' '}
              <Link
                variant="subtitle2"
                sx={{ cursor: 'pointer' }}
                onClick={() => prefillMessage('I have questions about the Attributes Uploads')}
              >
                contact us
              </Link>{' '}
              if you have questions.
            </Typography>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{ boxShadow: theme.customShadows.primary }}
            >
              Upload Attributes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
