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
import { paths } from 'src/routes/paths';
import {
  attributeUploadsWebhook,
  createAttributeUploads,
} from 'src/services/db/attributes-uploads';
import { CreateAttributeUploadsPropType } from 'src/types/attribute-uploads';
import { PlatformOptionsType } from 'src/types/dropdown-types';
import { normalizeHeader } from 'src/utils';
import { parseCSVFile } from 'src/utils/csv-parse';
import { handleFileUpload } from 'src/utils/upload-file-to-signed-url';
import * as Yup from 'yup';

export const NewAttributesForm = ({
  columnOptions,
  headerMapping,
}: {
  columnOptions: PlatformOptionsType;
  headerMapping: Record<string, string>;
}) => {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const { hosts } = useGetSeedSettings();
  const { prefillMessage } = useSalesmateChat();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<null | string>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedCols, setMappedCols] = useState<Record<string, string>>({});
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [csvData, setCsvData] = useState([]);

  const router = useRouter();
  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('List name is required'),
    host_id: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required')
      .nullable()
      .notOneOf([null], 'Sender profile is required'),
    update_existing: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: format(new Date(), 'MMM do yyyy'),
      host_id: null,
      update_existing: true,
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

      // Upload file to cloud bucket
      const uploadResult = await handleFileUpload(formData, 'attribute');
      if (uploadResult?.error) {
        enqueueSnackbar(uploadResult.error, { variant: 'error', persist: true });
        return;
      }

      // Create document in the database
      const databaseResponse = await createAttributeUploads(
        data as CreateAttributeUploadsPropType,
        uploadResult.url as string,
        mappedCols
      );

      if (databaseResponse?.error) {
        enqueueSnackbar(databaseResponse.error, { variant: 'error', persist: true });
        return;
      }

      // Increment attribute credits and trigger webhook
      await attributeUploadsWebhook();

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

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];

      if (!uploadedFile) return;

      setFile(uploadedFile);
      setFileError(null);

      try {
        // Parse CSV file
        const result = await parseCSVFile(uploadedFile);
        const headers = result.meta.fields || [];
        const data = result.data;

        // Update state to open form
        setCsvHeaders(headers);
        setCsvData(data);

        // Prefill mappedCols based on predefined mappings, ensuring unique assignments
        const usedMappings: Record<string, boolean> = {}; // Tracks assigned values

        const initialMappedCols = headers.reduce(
          (acc: Record<string, string>, header: string) => {
            const normalizedHeader = normalizeHeader(header);
            const mappedValue = headerMapping[normalizedHeader as keyof typeof headerMapping] || '';

            if (mappedValue && !usedMappings[mappedValue]) {
              usedMappings[mappedValue] = true; // Mark this value as used
              acc[header] = mappedValue; // Assign the mapped value to the header
            }

            return acc;
          },
          {} as Record<string, string>
        );

        // Pre-populate selectedValues with unique prefilled mappings
        const prefilledValues = Object.keys(usedMappings);
        setMappedCols(initialMappedCols);
        setSelectedValues(prefilledValues);
      } catch (error) {
        console.error('CSV Parsing Error', error);
        setFileError('Error parsing CSV file. Please check the format.');
      }
    },
    [headerMapping]
  );

  const handleRemoveFile = () => {
    setFile(null);
    setCsvHeaders([]);
    setMappedCols({});
    setSelectedValues([]);
  };

  const handleColumnChange = (newValue: any, header: string) => {
    const newMappedCols = {
      ...mappedCols,
      [header]: newValue ? newValue.value : '', // Use header as the key
    };

    // Update selectedValues to remove the previously selected value
    const updatedSelectedValues = newValue
      ? [...selectedValues.filter((value) => value !== newValue.value), newValue.value]
      : selectedValues.filter((value) => value !== mappedCols[header]);

    setMappedCols(newMappedCols);
    setSelectedValues(updatedSelectedValues);
  };

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
                  name="host_id"
                  label="Choose sender profile"
                  placeholder="outreachmagic"
                  options={hostOptions}
                />
              </Box>
              <RHFSwitch
                name="update_existing"
                label="Replace existing attributes with new import name (recommended)"
              />
              <UploadDocument
                file={file}
                fileError={fileError}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
                accept={{ 'text/csv': [] }}
              />
            </Stack>
            {csvHeaders.length > 0 && (
              <Stack spacing={2} sx={{ mt: 2, overflowY: 'auto', maxHeight: '700px' }}>
                <Box sx={{ padding: 3 }}>
                  {csvHeaders.map((header) => (
                    <Box
                      key={header}
                      columnGap={2}
                      rowGap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                      sx={{ padding: 3 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <Typography variant="subtitle1">{header}</Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {csvData.slice(0, 3).map((data, i) => {
                            return (
                              <Box
                                sx={{
                                  borderLeft: '1px solid lightgray',
                                  borderRight: '1px solid lightgray',
                                  borderBottom: '1px solid lightgray',
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  // Only add top border to the first item:
                                  ...(i === 0 && { borderTop: '1px solid lightgray' }),
                                  padding: 1,
                                  color: 'gray',
                                }}
                                key={`${data[header]}-${i}`}
                              >
                                {data[header] ? `${i + 1}. ${data[header]}` : `${i + 1}. No Value`}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ visibility: 'hidden' }}>
                          Belongs to
                        </Typography>

                        <RHFAutocomplete
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          name={`mapping.${header}`}
                          label="Set column name"
                          value={
                            columnOptions.find((opt) => opt.value === mappedCols[header]) || null
                          }
                          onChange={(_, newValue) => handleColumnChange(newValue, header)}
                          options={columnOptions.filter(
                            (opt) =>
                              !selectedValues.includes(opt.value) ||
                              mappedCols[header] === opt.value
                          )}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Stack>
            )}
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
              Upload the csv list of emails you would like us to verify.{' '}
              <Link
                variant="subtitle2"
                sx={{ cursor: 'pointer' }}
                onClick={() => prefillMessage('I have questions about the Attributes Uploads')}
              >
                Contact support
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
